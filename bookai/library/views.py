from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
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
    # Added Filtering Logic
    queryset = Favorite.objects.filter(user=request.user).select_related("book")
    
    # Filter by Search
    search = request.query_params.get('search')
    if search:
        queryset = queryset.filter(book__title__icontains=search) | queryset.filter(book__author__icontains=search)
    
    # Filter by Rating
    rating_filter = request.query_params.get('rating')
    if rating_filter and rating_filter != '0':
        queryset = queryset.filter(rating=rating_filter)

    data = [
        {
            "id": fav.book.id,
            "title": fav.book.title,
            "author": fav.book.author,
            "rating": fav.rating, # Crucial: Pass the rating to the frontend!
        }
        for fav in queryset
    ]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_book(request):
    book_id = request.data.get('book_id')
    rating = request.data.get('rating')
    
    try:
        fav = Favorite.objects.get(user=request.user, book_id=book_id)
        fav.rating = rating
        fav.save()
        return Response({'message': 'Rating updated'})
    except Favorite.DoesNotExist:
        return Response({'error': 'Book not in library'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def community_feed(request):
    recent_saves = Favorite.objects.select_related('book').order_by('-id')[:10]
    data = [{
        'book_title': fav.book.title,
        'author': fav.book.author,
        'time_ago': "Just now"
    } for fav in recent_saves]
    return Response(data)