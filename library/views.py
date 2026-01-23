from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Favorite
from books.models import Book


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_favorites(request):
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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_from_favorites(request):
    book_id = request.data.get("book_id")

    deleted, _ = Favorite.objects.filter(user=request.user, book_id=book_id).delete()

    if deleted:
        return Response({"message": "Removed from favorites"})
    return Response({"error": "Not in favorites"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_favorites(request):
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
