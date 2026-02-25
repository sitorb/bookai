import os
import pickle
from books.models import Book
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

# Автоматически определяем путь к файлу индекса в папке проекта
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pickle_path = os.path.join(BASE_DIR, 'book_embeddings.pkl')

def generate_embeddings():
    """Создание векторного индекса для поиска."""
    # Берем первые 20,000 книг для баланса скорости и качества
    queryset = Book.objects.only('id', 'title', 'summary')[:20000] 
    
    print(f"DEBUG: Я СЕЙЧАС БЕРУ {queryset.count()} КНИГ ИЗ БАЗЫ")
    
    if not queryset.exists():
        print("Ошибка: Книги не найдены в базе.")
        return

    ids = []
    texts = []
    
    for b in queryset:
        ids.append(b.id)
        # Объединяем название и описание для анализа
        content = f"{b.title} {(b.summary or '')[:400]}"
        texts.append(content)

    print("🔮 Векторизация смыслов (TF-IDF)...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(texts)

    print("✂️ Сжатие данных (LSA/SVD)...")
    svd = TruncatedSVD(n_components=100)
    matrix = svd.fit_transform(tfidf_matrix)

    data = {
        'ids': ids,
        'matrix': matrix,
        'vectorizer': vectorizer,
        'svd': svd
    }

    with open(pickle_path, 'wb') as f:
        pickle.dump(data, f)
    
    print(f"✅ AI успешно обучен на {len(ids)} книгах.")

def get_recommendations(user_query, top_n=12):
    """Поиск наиболее похожих книг по запросу пользователя."""
    if not os.path.exists(pickle_path):
        print("Файл модели не найден, возвращаем случайные книги")
        return Book.objects.all().order_by('?')[:top_n]

    with open(pickle_path, 'rb') as f:
        data = pickle.load(f)

    # Превращаем запрос пользователя в вектор
    query_tfidf = data['vectorizer'].transform([user_query])
    query_vec = data['svd'].transform(query_tfidf)

    # Считаем похожесть
    similarities = cosine_similarity(query_vec, data['matrix']).flatten()
    
    # Берем индексы самых похожих книг
    related_indices = similarities.argsort()[-top_n:][::-1]
    recommended_ids = [data['ids'][i] for i in related_indices]

    # Важно: сохраняем порядок, который выдал AI
    preserved = {id: index for index, id in enumerate(recommended_ids)}
    result_books = list(Book.objects.filter(id__in=recommended_ids))
    result_books.sort(key=lambda x: preserved.get(x.id))

    return result_books