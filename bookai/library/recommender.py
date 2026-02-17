import os
import pickle
import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def clean_text(text):
    """ Очистка текста от HTML и лишних символов. """
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zа-яё\s]', '', text) # Поддержка латиницы и кириллицы
    return text

def get_recommendations(user_query, top_n=10):
    """ 
    Находит подходящие книги. 
    Возвращает список ОБЪЕКТОВ Book для сериализатора.
    """
    # Ленивый импорт внутри функции, чтобы избежать ImportError
    from books.models import Book

    pickle_path = 'book_embeddings.pkl'
    if not os.path.exists(pickle_path):
        # Если файла нет, возвращаем просто последние книги, чтобы API не падало
        return Book.objects.all()[:top_n]
    
    try:
        with open(pickle_path, 'rb') as f:
            data = pickle.load(f)

        # Обработка запроса
        query_clean = clean_text(user_query)
        query_vector = data['vectorizer'].transform([query_clean])
        query_concept = data['svd'].transform(query_vector)

        # Расчет сходства
        similarities = cosine_similarity(query_concept, data['matrix'])[0]

        # Получаем ID книг, у которых сходство > 0
        relevant_indices = np.where(similarities > 0)[0]
        if len(relevant_indices) == 0:
            return Book.objects.all()[:top_n]

        # Сортируем индексы по убыванию сходства
        sorted_indices = relevant_indices[np.argsort(similarities[relevant_indices])[::-1]]
        
        # Получаем ID из сохраненного списка в pkl
        recommended_ids = [data['ids'][i] for i in sorted_indices[:top_n]]

        # Сохраняем порядок сортировки через Preserved Index
        preserved = models.Case(*[models.When(pk=pk, then=pos) for pos, pk in enumerate(recommended_ids)])
        return Book.objects.filter(id__in=recommended_ids).order_by(preserved)

    except Exception as e:
        print(f"Recommender error: {e}")
        return Book.objects.all()[:top_n]
def generate_embeddings():
    from books.models import Book
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.decomposition import TruncatedSVD

    print("🧠 AI начинает анализировать 10,000 книг...")
    
    # Используем .only(), чтобы тянуть из базы только нужные поля
    queryset = Book.objects.prefetch_related('moods').only('id', 'title', 'summary')
    
    texts = []
    ids = []
    
    for b in queryset.iterator(chunk_size=2000):
        mood_tags = " ".join([m.name for m in b.moods.all()])
        # Даем настроениям БОЛЬШЕ веса, повторяя их
        combined = clean_text(f"{b.title} {b.summary} {mood_tags} {mood_tags} {mood_tags}")
        texts.append(combined)
        ids.append(b.id)

    # Параметры для 10k записей
    vectorizer = TfidfVectorizer(
        stop_words='english', 
        ngram_range=(1, 2), 
        max_features=20000, # Увеличиваем словарь
        min_df=2 # Игнорируем слова, которые встречаются только 1 раз (опечатки)
    )
    
    tfidf_matrix = vectorizer.fit_transform(texts)

    # Увеличиваем количество компонентов SVD до 300 для лучшей точности на больших данных
    n_components = min(300, tfidf_matrix.shape[1] - 1)
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    concept_matrix = svd.fit_transform(tfidf_matrix)

    data = {
        'vectorizer': vectorizer, 
        'svd': svd, 
        'matrix': concept_matrix.astype('float32'), # float32 экономит место
        'ids': ids
    }

    with open('book_embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    return f"Success! AI brain now contains {len(ids)} book souls."