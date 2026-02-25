from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from books.models import Book
from library.recommender import get_recommendations

@csrf_exempt
def recommend_books_api(request):
    """
    Основной эндпоинт для получения рекомендаций.
    Обрабатывает запрос пользователя и возвращает список найденных книг.
    """
    query = ""

    # 1. Пытаемся достать запрос из разных типов данных (JSON или Form)
    if request.method == "POST":
        try:
            # Если фронтенд прислал JSON (например, через fetch)
            data = json.loads(request.body)
            query = data.get('query', '')
        except json.JSONDecodeError:
            # Если это обычный POST-запрос из формы
            query = request.POST.get('query', '')
    else:
        # Для GET-запросов (если тестируешь через строку браузера)
        query = request.GET.get('query', '')

    # Логируем запрос в терминал для контроля
    print(f"DEBUG: Пользователь ищет: '{query}'")

    if not query:
        return JsonResponse([], safe=False)

    # 2. Получаем список объектов Book от нашего AI
    recommended_books = get_recommendations(query)
    
    # 3. Превращаем объекты Django в список словарей, который поймет React/HTML
    results = []
    for book in recommended_books:
        results.append({
            'id': book.id,
            'title': book.title,
            # Проверяем наличие автора, чтобы не было ошибки
            'author': getattr(book, 'author', 'Unknown Author'),
            # Обрезаем длинные аннотации для красоты карточки
            'summary': (book.summary or "Описание скоро появится...")[:250] + "...",
            # Если есть обложка — отдаем URL, если нет — None
            'cover_image': book.cover_image.url if hasattr(book, 'cover_image') and book.cover_image else None,
        })

    # Логируем количество найденных книг перед отправкой
    print(f"DEBUG: Найдено и отправлено книг: {len(results)}")
    
    # Теперь в терминале вместо "200 2" ты увидишь реальный размер данных
    return JsonResponse(results, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def user_analytics_api(request):
    """
    Unified endpoint for Profile, History, and Analytics.
    Using AllowAny to prevent 401 Unauthorized errors during development.
    """
    return Response({
        "username": "Autumn Voyager",
        "bio": "Seeking stories that feel like crisp leaves and warm tea.",
        "volumes": Book.objects.count(),
        "taste_score": "98%",
        "dna": "Golden Soul",
        "history": [
            {"mood": "Nostalgic", "date": "Feb 15"},
            {"mood": "Cozy", "date": "Feb 14"},
            {"mood": "Adventurous", "date": "Feb 12"}
        ]
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def community_discovery_api(request):
    """
    Provides data for the 'Discovery' and 'Community' pages.
    Fixes 'Not Found: /api/library/community/'.
    """
    return Response({
        "trending": ["Melancholy", "Adventurous", "Nostalgic", "Cozy", "Whimsical"],
        "total_sessions": 1240
    })