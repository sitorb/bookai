import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from books.models import Book
from library.recommender import get_recommendations

@csrf_exempt
# Поменял название на recommend_books_api, как просит твой urls.py
def recommend_books_api(request):
    """
    Основной эндпоинт для получения рекомендаций.
    """
    query = ""

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get('query', '')
        except (json.JSONDecodeError, AttributeError):
            query = request.POST.get('query', '')
    else:
        query = request.GET.get('query', '')

    print(f"DEBUG: Пользователь ищет: '{query}'")

    if not query:
        return JsonResponse([], safe=False)

    recommended_books = get_recommendations(query)
    
    results = []
    for book in recommended_books:
        results.append({
            'id': book.id,
            'title': book.title,
            'author': getattr(book, 'author', 'Unknown Author'),
            'summary': (book.summary or "Описание скоро появится...")[:250] + "...",
            'cover_image': book.cover_image.url if hasattr(book, 'cover_image') and book.cover_image else None,
        })

    print(f"DEBUG: Найдено и отправлено книг: {len(results)}")
    
    return JsonResponse(results, safe=False)