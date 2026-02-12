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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_book(request):
    book_id = request.data.get('book_id')
    rating = request.data.get('rating') # Expecting 1-5
    
    try:
        fav = Favorite.objects.get(user=request.user, book_id=book_id)
        fav.rating = rating
        fav.save()
        return Response({'message': 'Rating updated'})
    except Favorite.DoesNotExist:
        return Response({'error': 'Book not in library'}, status=404)
    

# library/views.py
from rest_framework.response import Response
from .models import Favorite

@api_view(['GET'])
@permission_classes([AllowAny]) # Anyone can see what's trending
def community_feed(request):
    # Fetch the 10 most recent saves across the whole site
    recent_saves = Favorite.objects.select_related('book').order_by('-id')[:10]
    
    data = [{
        'book_title': fav.book.title,
        'author': fav.book.author,
        'time_ago': "Just now" # You can use humanize for real timestamps later
    } for fav in recent_saves]
    
    return Response(data)