import os
import pickle
import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from django.db import models

def clean_text(text):
    """ 
    Очистка текста. Поддерживает кириллицу и латиницу.
    Минимизирует использование памяти, убирая лишние пробелы.
    """
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)  # Удаление HTML
    text = re.sub(r'[^a-zа-яё0-9\s]', '', text)
    return " ".join(text.split())

def generate_embeddings():
    """ 
    Safe Mode: Генерация эмбеддингов с защитой от переполнения RAM.
    """
    from books.models import Book
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.decomposition import TruncatedSVD

    print("🛠 Запуск оптимизированной генерации (10,000 книг)...")
    
    # Извлекаем только необходимые поля, чтобы не перегружать память
    queryset = Book.objects.only('id', 'title', 'summary').prefetch_related('moods')
    
    texts = []
    ids = []
    
    # Обработка чанками (кусками) для стабильности
    for b in queryset.iterator(chunk_size=1000):
        moods = " ".join([m.name for m in b.moods.all()])
        # Настроениям даем приоритет, описание ограничиваем первыми 500 символами
        content = f"{moods} {moods} {b.title} {b.summary[:500]}" 
        texts.append(clean_text(content))
        ids.append(b.id)

    if not texts:
        return "библиотека пуста."

    # ОПТИМИЗАЦИЯ RAM:
    # 1. ngram_range=(1, 1) — только слова, без пар (экономит 70% памяти).
    # 2. max_features=5000 — ограничение словаря.
    vectorizer = TfidfVectorizer(
        stop_words='english',
        ngram_range=(1, 1), 
        max_features=5000,
        min_df=3 
    )
    
    # Преобразуем в float32 для экономии места
    tfidf_matrix = vectorizer.fit_transform(texts).astype(np.float32)
    
    # ВАЖНО: Удаляем список текстов из памяти перед запуском тяжелого SVD
    del texts 

    # SVD (LSA) — сжатие до 100 ключевых смыслов
    n_components = min(100, tfidf_matrix.shape[1] - 1)
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    concept_matrix = svd.fit_transform(tfidf_matrix).astype(np.float32)

    data = {
        'vectorizer': vectorizer, 
        'svd': svd, 
        'matrix': concept_matrix, 
        'ids': ids
    }

    # Сохраняем в корневой папке проекта
    with open('book_embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    return f"Успех! AI проанализировал {len(ids)} книг."

def get_recommendations(user_query, top_n=12):
    """ 
    Поиск книг по вектору запроса.
    """
    from books.models import Book

    pickle_path = 'book_embeddings.pkl'
    if not os.path.exists(pickle_path):
        return Book.objects.all().order_by('?')[:top_n]

    with open(pickle_path, 'rb') as f:
        data = pickle.load(f)

    clean_query = clean_text(user_query)
    if not clean_query:
        return Book.objects.all().order_by('?')[:top_n]

    # Преобразуем запрос в ту же систему координат, что и книги
    query_vector = data['vectorizer'].transform([clean_query])
    query_concept = data['svd'].transform(query_vector)

    # Считаем похожесть
    similarities = cosine_similarity(query_concept, data['matrix'])[0]

    # Отбираем лучшие совпадения (индекс > 0.01 чтобы отсечь мусор)
    relevant_indices = np.where(similarities > 0.01)[0]
    
    if len(relevant_indices) == 0:
        return Book.objects.all().order_by('?')[:top_n]

    # Сортировка по степени схожести
    sorted_relevant = sorted(relevant_indices, key=lambda i: similarities[i], reverse=True)
    top_ids = [data['ids'][i] for i in sorted_relevant[:top_n]]

    # Возвращаем QuerySet с сохранением порядка (самые похожие — первыми)
    preserved_order = models.Case(
        *[models.When(pk=pk, then=pos) for pos, pk in enumerate(top_ids)]
    )
    
    return Book.objects.filter(id__in=top_ids).order_by(preserved_order)