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
    text = re.sub(r'[^a-zа-яё\s]', '', text)
    return text

def generate_embeddings():
    from books.models import Book
    print("🧠 Создаем поисковый индекс (без Torch)...")
    
    books = Book.objects.all()
    if not books.exists(): return "No books."

    # Собираем данные: Название + Описание + Настроения
    texts = []
    ids = []
    for b in books.iterator():
        moods = " ".join([m.name for m in b.moods.all()])
        # Даем настроениям больше веса, повторяя их
        texts.append(clean_text(f"{b.title} {b.summary} {moods} {moods}"))
        ids.append(b.id)

    # Используем TF-IDF + LSA (SVD) для понимания смысла
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=15000)
    matrix = vectorizer.fit_transform(texts)

    # Сжимаем матрицу до 200 "смысловых концептов"
    svd = TruncatedSVD(n_components=min(200, matrix.shape[1]-1))
    concept_matrix = svd.fit_transform(matrix)

    data = {'vectorizer': vectorizer, 'svd': svd, 'matrix': concept_matrix, 'ids': ids}
    
    with open('book_embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    return f"Готово! Индекс создан для {len(ids)} книг."

def get_recommendations(user_query, top_n=10):
    from books.models import Book
    
    path = 'book_embeddings.pkl'
    if not os.path.exists(path): return Book.objects.all()[:top_n]

    with open(path, 'rb') as f:
        data = pickle.load(f)

    # Превращаем запрос в вектор того же пространства
    query_vec = data['vectorizer'].transform([clean_text(user_query)])
    query_concept = data['svd'].transform(query_vec)

    # Считаем сходство
    sims = cosine_similarity(query_concept, data['matrix'])[0]
    
    # Берем лучшие индексы
    top_indices = np.argsort(sims)[::-1][:top_n]
    recommended_ids = [data['ids'][i] for i in top_indices]

    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(recommended_ids)])
    return Book.objects.filter(id__in=recommended_ids).order_by(preserved)