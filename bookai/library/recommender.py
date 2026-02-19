import os
import pickle
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from django.db.models import Case, When

def clean_text(text):
    if not text: return ""
    text = text.lower()
    # Очистка текста: оставляем только буквы (латиница и кириллица)
    text = re.sub(r'[^a-zа-яё\s]', '', text)
    return text

def generate_embeddings():
    from books.models import Book
    print("🧠 Создаем поисковый индекс (LSA)...")
    
    books = Book.objects.all()
    if not books.exists():
        return "В базе нет книг для анализа."

    texts = []
    ids = []
    
    # Используем итератор для экономии памяти при 10к книг
    for b in books.iterator():
        mood_tags = " ".join([m.name for m in b.moods.all()])
        # Комбинируем данные, усиливая значимость настроений
        combined = f"{b.title} {b.summary} {mood_tags} {mood_tags}"
        texts.append(clean_text(combined))
        ids.append(b.id)

    # Векторизация TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english', max_features=15000, ngram_range=(1, 2))
    tfidf_matrix = vectorizer.fit_transform(texts)

    # Сжатие смыслов (SVD) — это позволяет AI понимать контекст без нейросетей
    svd = TruncatedSVD(n_components=min(200, tfidf_matrix.shape[1] - 1))
    concept_matrix = svd.fit_transform(tfidf_matrix)

    data = {
        'vectorizer': vectorizer,
        'svd': svd,
        'matrix': concept_matrix,
        'ids': ids
    }

    # Сохраняем индекс в файл
    with open('book_embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    return f"Успех! Индекс создан для {len(ids)} книг."

def get_recommendations(user_query, top_n=10):
    from books.models import Book
    
    file_path = 'book_embeddings.pkl'
    if not os.path.exists(file_path):
        return Book.objects.all()[:top_n]

    with open(file_path, 'rb') as f:
        data = pickle.load(f)

    # Обработка запроса пользователя
    query_clean = clean_text(user_query)
    query_vec = data['vectorizer'].transform([query_clean])
    query_concept = data['svd'].transform(query_vec)

    # Расчет косинусного сходства
    similarities = cosine_similarity(query_concept, data['matrix'])[0]
    
    # Сортировка по релевантности
    top_indices = np.argsort(similarities)[::-1][:top_n]
    recommended_ids = [data['ids'][i] for i in top_indices]

    # Возвращаем QuerySet с сохранением порядка AI-сортировки
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(recommended_ids)])
    return Book.objects.filter(id__in=recommended_ids).order_by(preserved)