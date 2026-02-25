import os
import pickle
from django.conf import settings
from books.models import Book
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

# Прямая ссылка на корень проекта, где лежит файл
pickle_path = os.path.join(settings.BASE_DIR, 'book_embeddings.pkl')

def generate_embeddings():
    """Создание векторного индекса для поиска."""
    # Берем ровно столько, сколько в базе
    queryset = Book.objects.only('id', 'title', 'summary').all()[:20000]
    
    print(f"DEBUG: Обучаюсь на {queryset.count()} книгах из базы...")
    
    if not queryset.exists():
        print("Ошибка: База пуста!")
        return

    ids = [b.id for b in queryset]
    texts = [f"{b.title} {(b.summary or '')[:400]}" for b in queryset]

    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(texts)

    svd = TruncatedSVD(n_components=100)
    matrix = svd.fit_transform(tfidf_matrix)

    data = {'ids': ids, 'matrix': matrix, 'vectorizer': vectorizer, 'svd': svd}

    with open(pickle_path, 'wb') as f:
        pickle.dump(data, f)
    print(f"✅ Файл создан по пути: {pickle_path}")

def get_recommendations(user_query, top_n=12):
    """Поиск книг по запросу."""
    if not os.path.exists(pickle_path):
        print(f"⚠️ Файл НЕ НАЙДЕН по пути: {pickle_path}")
        return Book.objects.all().order_by('?')[:top_n]

    with open(pickle_path, 'rb') as f:
        data = pickle.load(f)

    query_tfidf = data['vectorizer'].transform([user_query])
    query_vec = data['svd'].transform(query_tfidf)
    similarities = cosine_similarity(query_vec, data['matrix']).flatten()
    
    related_indices = similarities.argsort()[-top_n:][::-1]
    recommended_ids = [data['ids'][i] for i in related_indices]
    
    print(f"DEBUG: AI нашел ID: {recommended_ids}")

    # Извлекаем книги и сохраняем порядок
    preserved = {id: index for index, id in enumerate(recommended_ids)}
    result_books = list(Book.objects.filter(id__in=recommended_ids))
    result_books.sort(key=lambda x: preserved.get(x.id))

    return result_books