from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Favorite
from books.models import Book


class AddToFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get("book_id")

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

        favorite, created = Favorite.objects.get_or_create(user=request.user, book=book)

        return Response({
            "message": "Added to favorites" if created else "Already in favorites",
            "book": {"id": book.id, "title": book.title}
        })


class RemoveFromFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get("book_id")

        deleted, _ = Favorite.objects.filter(user=request.user, book_id=book_id).delete()

        if deleted:
            return Response({"message": "Removed from favorites"})
        return Response({"error": "Not in favorites"}, status=status.HTTP_404_NOT_FOUND)
class ListFavoritesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related("book")

        data = [
            {
                "id": fav.book.id,
                "title": fav.book.title,
                "author": fav.book.author,
            }
            for fav in favorites
        ]

        return Response({"favorites": data})
