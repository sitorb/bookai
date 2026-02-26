import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from books.models import Book
from library.recommender import get_recommendations

@csrf_exempt
def recommend_books_api(request):
    """
    Эндпоинт для рекомендаций, синхронизированный с React-ключом 'mood'.
    """
    query = ""

    if request.method == "POST":
        try:
            # Читаем данные из React (axios шлет JSON)
            data = json.loads(request.body)
            # Ищем 'mood' (как в React) или 'query' (для универсальности)
            query = data.get('mood') or data.get('query', '')
        except (json.JSONDecodeError, AttributeError):
            query = request.POST.get('mood') or request.POST.get('query', '')
    else:
        query = request.GET.get('mood') or request.GET.get('query', '')

    print(f"--- АНАЛИЗ ЗАПРОСА ---")
    print(f"DEBUG: Получен текст (mood): '{query}'")

    if not query or len(str(query).strip()) < 2:
        print("DEBUG: Запрос пустой.")
        return JsonResponse([], safe=False)

    # Получаем рекомендации от AI
    recommended_books = get_recommendations(str(query))
    
    results = []
    for book in recommended_books:
        # Формируем словарь, который в точности ожидает React
        results.append({
            'id': book.id,
            'title': book.title,
            'author': getattr(book, 'author', 'Unknown Author'),
            'summary': (book.summary or "No description available.")[:250] + "...",
            # Поле называется 'cover_image' для соответствия модели Django
            'cover_image': book.cover_image.url if hasattr(book, 'cover_image') and book.cover_image else None,
            'publication_year': getattr(book, 'publication_year', None)
        })

    print(f"DEBUG: Отправлено книг на фронтенд: {len(results)}")
    return JsonResponse(results, safe=False)