from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json

from books.models import Book
from .models import Recommendation

@csrf_exempt
def get_recommendations(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)
        user_input = data.get("text")
        context_type = data.get("context", "feel")  # feel / want
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not user_input:
        return JsonResponse({"error": "Text is required"}, status=400)

    # 🔹 Заглушка: берём первые 5 книг из базы
    books = Book.objects.all()[:5]

    recommendations = []
    for book in books:
        reason = f"Эта книга выбрана, потому что вы написали: «{user_input}»."
        rec = Recommendation.objects.create(
            user=request.user if request.user.is_authenticated else None,
            book=book,
            context_type=context_type,
            user_input=user_input,
            reason=reason,
            confidence_score=0.5,
        )
        recommendations.append({
            "title": book.title,
            "author": book.author,
            "reason": reason,
            "confidence": 0.5,
        })

    return JsonResponse({"recommendations": recommendations})
