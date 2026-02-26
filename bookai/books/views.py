import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from books.models import Book
from library.recommender import get_recommendations

# Настройка простого логирования в консоль
logger = logging.getLogger(__name__)

@csrf_exempt
def recommend_books_api(request):
    """
    Эндпоинт для рекомендаций. Совместим с React и GitHub-стандартами.
    """
    query = ""

    if request.method == "POST":
        # Логируем тип контента для отладки
        content_type = request.META.get('CONTENT_TYPE', '')
        
        try:
            if 'application/json' in content_type:
                # Читаем JSON (стандарт для React fetch/axios)
                data = json.loads(request.body)
                # Проверяем все возможные ключи, которые мог отправить фронтенд
                query = data.get('query') or data.get('text') or data.get('prompt', '')
            else:
                # Читаем обычные данные формы
                query = request.POST.get('query', '')
        except Exception as e:
            print(f"Ошибка при разборе запроса: {e}")
    
    # Если POST пустой, пробуем GET (для тестов из браузера)
    if not query:
        query = request.GET.get('query', '')

    # Выводим в терминал для контроля
    print(f"--- АНАЛИЗ ЗАПРОСА ---")
    print(f"DEBUG: Получен текст: '{query}'")

    if not query or len(str(query).strip()) < 2:
        print("DEBUG: Запрос слишком короткий или пустой.")
        return JsonResponse([], safe=False)

    # 1. Получаем рекомендации (объекты Book)
    try:
        recommended_books = get_recommendations(str(query))
    except Exception as e:
        print(f"Ошибка в работе AI: {e}")
        return JsonResponse({"error": "AI recommendation failed"}, status=500)
    
    # 2. Формируем список для фронтенда
    results = []
    for book in recommended_books:
        results.append({
            'id': book.id,
            'title': book.title,
            'author': getattr(book, 'author', 'Unknown Author'),
            'summary': (book.summary or "Описание отсутствует...")[:300] + "...",
            'cover_image': book.cover_image.url if hasattr(book, 'cover_image') and book.cover_image else None,
        })

    print(f"DEBUG: Успешно отправлено книг: {len(results)}")
    
    # Теперь в логах будет не "200 2", а реальный размер данных
    return JsonResponse(results, safe=False)