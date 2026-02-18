import os
import pickle
import torch
from sentence_transformers import SentenceTransformer, util
from books.models import Book

# Загружаем модель (сделает это один раз при запуске)
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embeddings():
    """ Создает 'смысловые отпечатки' для всех книг в базе """
    from books.models import Book
    
    books = Book.objects.all()
    if not books.exists():
        return "No books found."

    # Собираем тексты: Название + Описание
    # Мы не чистим текст сильно, так как BERT понимает знаки препинания и контекст
    book_texts = [f"{b.title}. {b.summary}" for b in books]
    book_ids = [b.id for b in books]

    print(f"🧠 AI анализирует {len(book_texts)} книг... это может занять минуту.")
    
    # Превращаем тексты в векторы (эмбеддинги)
    embeddings = model.encode(book_texts, convert_to_tensor=True)

    data = {
        'embeddings': embeddings,
        'ids': book_ids
    }

    with open('book_embeddings_bert.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    return "BERT embeddings generated successfully!"

def get_recommendations(user_query, top_n=5):
    """ Ищет книги по смыслу запроса, а не по словам """
    from books.models import Book
    from django.db.models import Case, When

    if not os.path.exists('book_embeddings_bert.pkl'):
        return Book.objects.all()[:top_n]

    with open('book_embeddings_bert.pkl', 'rb') as f:
        data = pickle.load(f)

    # 1. Кодируем запрос пользователя в такой же вектор
    query_embedding = model.encode(user_query, convert_to_tensor=True)

    # 2. Считаем косинусное сходство между запросом и всеми книгами
    # util.cos_sim вернет оценку от 0 до 1 для каждой книги
    cosine_scores = util.cos_sim(query_embedding, data['embeddings'])[0]

    # 3. Берем топ-N результатов
    top_results = torch.topk(cosine_scores, k=min(top_n, len(data['ids'])))
    
    indices = top_results.indices.tolist()
    recommended_ids = [data['ids'][i] for i in indices]

    # 4. Возвращаем книги с сохранением порядка релевантности
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(recommended_ids)])
    return Book.objects.filter(id__in=recommended_ids).order_by(preserved)