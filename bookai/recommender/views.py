from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import RecommendationHistory, RecommendedBook


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    user_input = request.data.get("text")

    if not user_input:
        return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

    history = RecommendationHistory.objects.create(
        user=request.user,
        input_text=user_input,
    )

    # Temporary fake recommendations
    books = [
        {"title": "1984", "author": "George Orwell"},
        {"title": "Pride and Prejudice", "author": "Jane Austen"},
        {"title": "The Hobbit", "author": "J.R.R. Tolkien"},
    ]

    recommendations = []

    for book in books:
        reason = f"This book matches your mood: '{user_input}'."

        RecommendedBook.objects.create(
            history=history,
            title=book["title"],
            author=book["author"],
            reason=reason,
        )

        recommendations.append({
            "title": book["title"],
            "author": book["author"],
            "reason": reason,
        })

    return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_history(request):
    histories = RecommendationHistory.objects.filter(user=request.user).order_by("-created_at")

    data = []
    for h in histories:
        books = h.books.all()
        data.append({
            "id": h.id,
            "input_text": h.input_text,
            "recommendations": [
                {
                    "title": b.title,
                    "author": b.author,
                    "reason": b.reason,
                }
                for b in books
            ],
            "created_at": h.created_at,
        })

    return Response(data)
