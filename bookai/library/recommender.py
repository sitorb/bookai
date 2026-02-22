import os
import pickle
import re
import gc  # Модуль для ручной очистки памяти
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from django.db import models

def clean_text(text):
    """ Очистка текста с жестким лимитом на количество слов для экономии RAM. """
    if not text: return ""
    text = text.lower()
    text = re.sub(r'<.*?>', '', text) # Убираем HTML из данных Goodreads
    text = re.sub(r'[^a-zа-яё\s]', '', text)
    # Берем только первые 70 слов — этого достаточно для понимания смысла
    return " ".join(text.split()[:70])

def generate_embeddings():
    """ Генерация индекса с защитой от переполнения RAM. """
    from books.models import Book
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.decomposition import TruncatedSVD

    print("🧠 Начинаю обучение AI. Режим экономии ресурсов активен...")
    
    ids = []
    texts = []
    
    # Итерируемся чанками (кусками), чтобы не загружать 10,000 объектов сразу
    queryset = Book.objects.only('id', 'title', 'summary').prefetch_related('moods')
    
    for b in queryset.iterator(chunk_size=1000):
        mood_tags = " ".join([m.name for m in b.moods.all()])
        # Настроения повторяем дважды для веса, описание обрезаем
        content = f"{mood_tags} {mood_tags} {b.title} {(b.summary or '')[:400]}"
        texts.append(clean_text(content))
        ids.append(b.id)
        
        # Раз в 2000 итераций чистим память от "хвостов" Python
        if len(ids) % 2000 == 0:
            gc.collect()

    if not texts:
        return "Ошибка: База данных книг пуста."

    # Настройка векторизатора (Safe Mode)
    vectorizer = TfidfVectorizer(
        stop_words='english', 
        max_features=4000, 
        min_df=4
    )
    
    # Преобразуем тексты в числа (float32 экономит 50% RAM)
    tfidf_matrix = vectorizer.fit_transform(texts).astype(np.float32)
    
    # КРИТИЧЕСКИ ВАЖНО: Удаляем массив строк сразу после векторизации
    del texts
    gc.collect()

    # Сжатие смыслов (LSA) до 100 компонентов
    svd = TruncatedSVD(n_components=100, random_state=42)
    concept_matrix = svd.fit_transform(tfidf_matrix).astype(np.float32)

    data = {
        'vectorizer': vectorizer, 
        'svd': svd, 
        'matrix': concept_matrix, 
        'ids': ids
    }

    # Сохраняем результат в корневую папку
    with open('book_embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    gc.collect()
    return f"Успех! AI проанализировал {len(ids)} книг."

def get_recommendations(user_query, top_n=12):
    """ Поиск с автоматическим фоллбэком на случайные книги при пустом результате. """
    from books.models import Book
    pickle_path = 'book_embeddings.pkl'
    
    if not os.path.exists(pickle_path):
        return Book.objects.all().order_by('?')[:top_n]

    with open(pickle_path, 'rb') as f:
        data = pickle.load(f)

    query = clean_text(user_query)
    if not query:
        return Book.objects.all().order_by('?')[:top_n]

    # Превращаем запрос в вектор
    q_vec = data['vectorizer'].transform([query])
    q_con = data['svd'].transform(q_vec)
    
    # Считаем косинусное сходство
    sims = cosine_similarity(q_con, data['matrix'])[0]

    # Отбираем индексы с заметным сходством (> 0.01)
    relevant_idx = np.where(sims > 0.01)[0]
    
    if len(relevant_idx) == 0:
        # Если ничего не нашли, возвращаем случайные из 10,000 для разнообразия
        return Book.objects.all().order_by('?')[:top_n]

    # Сортировка по релевантности
    sorted_idx = sorted(relevant_idx, key=lambda i: sims[i], reverse=True)[:top_n]
    top_ids = [data['ids'][i] for i in sorted_idx]

    # Сохраняем порядок в QuerySet (самые подходящие — сверху)
    preserved = models.Case(
        *[models.When(pk=pk, then=pos) for pos, pk in enumerate(top_ids)]
    )
    return Book.objects.filter(id__in=top_ids).order_by(preserved)