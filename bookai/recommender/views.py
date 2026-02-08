from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    user_input = request.data.get("text")
    if not user_input:
        return Response({"error": "Text is required"}, status=400)

    books = Book.objects.all()[:5]

    recommendations = []
    for book in books:
        recommendations.append({
            "title": book.title,
            "author": book.author,
            "reason": f"Because you wrote: {user_input}",
            "confidence": 0.5,
        })

    return Response({"recommendations": recommendations})
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import RecommendationHistory

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_history(request):
    history = RecommendationHistory.objects.filter(user=request.user).order_by("-created_at")
    data = [
        {
            "id": h.id,
            "input_text": h.input_text,
            "created_at": h.created_at,
        }
        for h in history
    ]
    return Response(data)
