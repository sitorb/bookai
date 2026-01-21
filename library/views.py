from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from .models import Favorite
from books.models import Book

@csrf_exempt
@login_required
def add_to_favorites(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    data = json.loads(request.body)
    book_id = data.get("book_id")

    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return JsonResponse({"error": "Book not found"}, status=404)

    favorite, created = Favorite.objects.get_or_create(user=request.user, book=book)

    return JsonResponse({
        "message": "Added to favorites" if created else "Already in favorites",
        "book": {"id": book.id, "title": book.title}
    })
@csrf_exempt
@login_required
def remove_from_favorites(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    data = json.loads(request.body)
    book_id = data.get("book_id")

    deleted, _ = Favorite.objects.filter(user=request.user, book_id=book_id).delete()

    if deleted:
        return JsonResponse({"message": "Removed from favorites"})
    return JsonResponse({"error": "Not in favorites"}, status=404)
@login_required
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

    return JsonResponse({"favorites": data})
