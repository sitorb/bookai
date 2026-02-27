import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from books.models import Book
from library.recommender import get_recommendations

@csrf_exempt
def recommend_books_api(request):
    """
    Финальная версия API: принимает 'mood', возвращает полные данные книг.
    """
    query = ""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get('mood') or data.get('query', '')
        except:
            query = request.POST.get('mood', '')
    
    print(f"--- АНАЛИЗ ЗАПРОСА ---")
    print(f"DEBUG: Получен текст (mood): '{query}'")

    if not query or len(str(query).strip()) < 2:
        return JsonResponse([], safe=False)

    # Получаем рекомендации от AI
    recommended_books = get_recommendations(str(query))
    
    results = []
    for book in recommended_books:
        # Пытаемся получить URL обложки
        cover_url = None
        if hasattr(book, 'cover_image') and book.cover_image:
            cover_url = book.cover_image.url
        elif hasattr(book, 'image_url') and book.image_url:
            cover_url = book.image_url

        results.append({
            'id': book.id,
            'title': book.title,
            'author': getattr(book, 'author', 'Unknown'),
            'summary': (book.summary or "No description.")[:300] + "...",
            'cover_image': cover_url,
            'publication_year': getattr(book, 'publication_year', '')
        })

    print(f"DEBUG: Отправлено книг на фронтенд: {len(results)}")
    return JsonResponse(results, safe=False)