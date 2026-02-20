import os
import pickle
import torch
import numpy as np
from sentence_transformers import SentenceTransformer, util
from django.db.models import Case, When

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_recommendations(user_query, top_n=10):
    from books.models import Book
    
    brain_path = os.path.join(os.getcwd(), 'book_brain.pkl')
    if not os.path.exists(brain_path):
        return Book.objects.all()[:top_n]

    with open(brain_path, 'rb') as f:
        data = pickle.load(f)
    
    # Считаем, сколько реально книг в базе (у вас это 5000)
    db_books = Book.objects.order_by('id')
    db_count = db_books.count()
    
    # Берем только те эмбеддинги, для которых есть книги в базе
    valid_embeddings = data['embeddings'][:db_count]
    
    # AI Поиск
    query_embedding = model.encode(user_query, convert_to_tensor=True)
    cos_scores = util.cos_sim(query_embedding, torch.tensor(valid_embeddings))[0]
    
    # Берем топ-N
    top_results = torch.topk(cos_scores, k=min(top_n, db_count))
    
    # Получаем ID книг из базы, которые соответствуют этим индексам
    all_db_ids = list(db_books.values_list('id', flat=True))
    recommended_ids = [all_db_ids[idx.item()] for idx in top_results.indices]

    # Возвращаем книги с сохранением порядка
    preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(recommended_ids)])
    return Book.objects.filter(id__in=recommended_ids).order_by(preserved)