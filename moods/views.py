from rest_framework.views import APIView
from rest_framework.response import Response
from .models import RecommendationHistory, RecommendedBook

class RecommendView(APIView):
    def post(self, request):
        text = request.data.get("text", "").lower()

        if any(word in text for word in ["груст", "одинок", "печаль", "пусто", "тяжело"]):
            recommendations = [
                {
                    "title": "Маленький принц",
                    "author": "Антуан де Сент-Экзюпери",
                    "reason": "Теплая и философская история, которая помогает почувствовать связь с миром."
                },
                {
                    "title": "Белые ночи",
                    "author": "Фёдор Достоевский",
                    "reason": "История о тонком одиночестве и надежде."
                }
            ]
        else:
            recommendations = [
                {
                    "title": "451° по Фаренгейту",
                    "author": "Рэй Брэдбери",
                    "reason": "Когда хочется задуматься о жизни и человеке."
                }
            ]

        history = RecommendationHistory.objects.create(input_text=text)

        for book in recommendations:
            RecommendedBook.objects.create(
                history=history,
                title=book["title"],
                author=book["author"],
                reason=book["reason"]
            )

        return Response({
            "history_id": history.id,
            "recommendations": recommendations
        })


class RecommendationHistoryView(APIView):
    def get(self, request):
        histories = RecommendationHistory.objects.prefetch_related("books").all().order_by("-created_at")

        data = []
        for h in histories:
            data.append({
                "id": h.id,
                "input_text": h.input_text,
                "created_at": h.created_at,
                "books": [
                    {
                        "title": b.title,
                        "author": b.author,
                        "reason": b.reason
                    } for b in h.books.all()
                ]
            })

        return Response(data)

from .models import FavoriteBook

class FavoriteView(APIView):
    def post(self, request):
        title = request.data.get("title")
        author = request.data.get("author")
        reason = request.data.get("reason", "")

        if not title or not author:
            return Response({"error": "Title and author are required"}, status=400)

        favorite = FavoriteBook.objects.create(
            title=title,
            author=author,
            reason=reason
        )

        return Response({
            "id": favorite.id,
            "title": favorite.title,
            "author": favorite.author,
            "reason": favorite.reason,
            "created_at": favorite.created_at
        }, status=201)


class FavoriteListView(APIView):
    def get(self, request):
        favorites = FavoriteBook.objects.all().order_by("-created_at")
        data = [
            {
                "id": f.id,
                "title": f.title,
                "author": f.author,
                "reason": f.reason,
                "created_at": f.created_at
            } for f in favorites
        ]
        return Response(data)
