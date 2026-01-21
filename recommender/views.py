from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from books.models import Book
from .models import Recommendation


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    user_input = request.data.get("text")
    context_type = request.data.get("context", "feel")

    if not user_input:
        return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

    books = Book.objects.all()[:5]

    recommendations = []
    for book in books:
        reason = f"Эта книга выбрана, потому что вы написали: «{user_input}»."
        Recommendation.objects.create(
            user=request.user,
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

    return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_recommendations(request):
    recs = Recommendation.objects.filter(user=request.user).order_by("-created_at")

    data = [
        {
            "title": rec.book.title,
            "author": rec.book.author,
            "reason": rec.reason,
            "confidence": rec.confidence_score,
            "created_at": rec.created_at,
        }
        for rec in recs
    ]

    return Response(data, status=status.HTTP_200_OK)
