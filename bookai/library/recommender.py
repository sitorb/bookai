import os
import pickle
import re
import gc
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from django.db import models

def clean_text(text):
    """ Очистка текста: убираем HTML, знаки препинания и лишние слова. """
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)  # Удаление HTML-тегов
    text = re.sub(r'[^a-zа-яё\s]', '', text)
    # Ограничиваем длину текста для экономии RAM
    return " ".join(text.split()[:70])

def generate_embeddings():
    """ 
    Создание векторного индекса для поиска. 
    Используем 15,000 книг, чтобы избежать ошибки SQLite 'too many SQL variables'.
    """
    from books.models import Book

    print("🧠 Подготовка AI: Анализирую 20,000 томов из архива...")
    
    # Берем срез данных, чтобы не перегрузить систему
    # Отключаем prefetch_related, чтобы избежать лимита переменных в SQLite
    queryset = Book.objects.only('id', 'title', 'summary')[:20000]
    
    ids = []
    texts = []
    
    for b in queryset:
        # Формируем контент для анализа (название + описание)
        content = f"{b.title} {(b.summary or '')[:400]}"
        texts.append(clean_text(content))
        ids.append(b.id)
        
    if not texts:
        return "Ошибка: Книги не найдены в базе."

    print("📊 Векторизация смыслов (TF-IDF)...")
    vectorizer = TfidfVectorizer(
        stop_words='english', 
        max_features=3000, 
        min_df=2
    )
    
    # Используем float32 для экономии 50% RAM
    tfidf_matrix = vectorizer.fit_transform(texts).astype(np.float32)
    
    # Принудительная очистка памяти от сырых текстов
    del texts
    gc.collect()

    print("✂️ Сжатие данных (LSA/SVD)...")
    svd = TruncatedSVD(n_components=100, random_state=42)
    concept_matrix = svd.fit_transform(tfidf_matrix).astype(np.float32)

    data = {
        'vectorizer': vectorizer, 
        'svd': svd, 
        'matrix': concept_matrix, 
        'ids': ids
    }

    # Сохраняем "мозг" AI в корень проекта
    pickle_path = 'book_embeddings.pkl'
    with open(pickle_path, 'wb') as f:
        pickle.dump(data, f)
    
    gc.collect()
    print(f"✅ AI успешно обучен на 20,000 книгах.")
    return "Успех! Модель готова к работе."

def get_recommendations(user_query, top_n=12):
    """ Поиск наиболее похожих книг по запросу пользователя. """
    from books.models import Book
    pickle_path = 'book_embeddings.pkl'
    
    # Если файл модели еще не создан, возвращаем случайные книги
    if not os.path.exists(pickle_path):
        return Book.objects.all().order_by('?')[:top_n]

    with open(pickle_path, 'rb') as f:
        data = pickle.load(f)

    query = clean_text(user_query)
    if not query:
        return Book.objects.all().order_by('?')[:top_n]

    # Преобразуем запрос пользователя в вектор пространства знаний AI
    try:
        q_vec = data['vectorizer'].transform([query])
        q_con = data['svd'].transform(q_vec)
        
        # Вычисляем близость (косинусное сходство)
        sims = cosine_similarity(q_con, data['matrix'])[0]
        
        # Получаем индексы самых похожих книг
        sorted_idx = np.argsort(sims)[::-1][:top_n]
        top_ids = [data['ids'][i] for i in sorted_idx]

        # Сохраняем порядок сортировки для Django QuerySet
        preserved = models.Case(
            *[models.When(pk=pk, then=pos) for pos, pk in enumerate(top_ids)]
        )
        return Book.objects.filter(id__in=top_ids).order_by(preserved)
        
    except Exception as e:
        print(f"Ошибка поиска: {e}")
        return Book.objects.all().order_by('?')[:top_n]