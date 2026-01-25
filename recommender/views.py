from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status



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


        RecommendationHistory.objects.create(
            user=request.user,
            book=book,
            context_type=context_type,
            user_input=user_input,
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
from .models import RecommendationHistory


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Recommendation

class RecommendationHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = Recommendation.objects.filter(user=request.user).select_related("book").order_by("-created_at")

        data = [
            {
                "book_id": rec.book.id,
                "title": rec.book.title,
                "author": rec.book.author,
                "reason": rec.reason,
                "confidence": rec.confidence_score,
                "context": rec.context_type,
                "created_at": rec.created_at,
            }
            for rec in history
        ]

        return Response({"history": data})

from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from moods.models import RecommendationHistory, RecommendedBook, FavoriteBook


class RecommendationAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_requests = RecommendationHistory.objects.count()
        total_recommendations = RecommendedBook.objects.count()
        total_favorites = FavoriteBook.objects.count()

        top_books = (
            RecommendedBook.objects
            .values("title", "author")
            .annotate(count=Count("id"))
            .order_by("-count")[:10]
        )

        recent_requests = RecommendationHistory.objects.order_by("-created_at")[:5]

        return Response({
            "total_requests": total_requests,
            "total_recommendations": total_recommendations,
            "total_favorites": total_favorites,
            "top_books": list(top_books),
            "recent_requests": [
                {"input_text": r.input_text, "created_at": r.created_at}
                for r in recent_requests
            ]
        })
