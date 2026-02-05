from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from books.models import Book
from .models import Recommendation, RecommendationHistory
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    user_input = request.data.get("text")
    context_type = request.data.get("context", "feel")

    if not user_input:
        return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

    books = Book.objects.all()[:5]
    user = request.user

    history = RecommendationHistory.objects.create(
        user=user,
        input_text=user_input,
    )

    recommendations = []

    for book in books:
        reason = f"Эта книга выбрана, потому что вы написали: «{user_input}»."

        RecommendedBook.objects.create(
            history=history,
            title=book.title,
            author=book.author,
            reason=reason,
        )

        recommendations.append({
            "title": book.title,
            "author": book.author,
            "reason": reason,
            "confidence": 0.5,
        })

    return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_history(request):
    history = RecommendationHistory.objects.filter(user=request.user).order_by("-created_at")

    data = []
    for h in history:
        recs = Recommendation.objects.filter(user=request.user).order_by("-created_at")
        data.append({
            "id": h.id,
            "input_text": h.input_text,
            "created_at": h.created_at,
            "recommendations": [
                {
                    "title": r.book.title,
                    "author": r.book.author,
                    "reason": r.reason,
                    "confidence": r.confidence_score,
                }
                for r in recs
            ]
        })

    return Response(data)
