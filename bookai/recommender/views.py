from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from books.models import Book
from moods.models import RecommendationHistory, RecommendedBook
from django.contrib.auth import get_user_model
User = get_user_model()

@api_view(["POST"])
#@permission_classes([])

def get_recommendations(request):
    user_input = request.data.get("text")
    context_type = request.data.get("context", "feel")

    if not user_input:
        return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

    books = Book.objects.all()[:5]
    user = request.user if request.user.is_authenticated else None

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

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from django.utils.timezone import now, timedelta

from moods.models import RecommendationHistory, RecommendedBook, FavoriteBook


class RecommendationAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Per-user filtering
        histories = RecommendationHistory.objects.filter(user=user)
        recommendations = RecommendedBook.objects.filter(history__user=user)
        favorites = FavoriteBook.objects.filter(user=user)

        # Basic counts
        total_requests = histories.count()
        total_recommendations = recommendations.count()
        total_favorites = favorites.count()

        # Top recommended books
        top_books = (
            recommendations
            .values("title", "author")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )

        # Recent recommendation requests
        recent_requests = histories.order_by("-created_at")[:5].values(
            "input_text", "created_at"
        )

        # Daily trend (last 7 days)
        last_7_days = now() - timedelta(days=7)
        daily_trend = (
            histories
            .filter(created_at__gte=last_7_days)
            .extra(select={'day': "date(created_at)"})
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )

        return Response({
            "total_requests": total_requests,
            "total_recommendations": total_recommendations,
            "total_favorites": total_favorites,
            "top_books": list(top_books),
            "recent_requests": list(recent_requests),
            "daily_trend": list(daily_trend),
        })
