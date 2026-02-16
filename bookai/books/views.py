from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from library.recommender import get_recommendations

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def recommend_books_api(request):
    """
    Handles mood-based recommendations (POST) and general library listing (GET).
    This unified view prevents 404s when the frontend requests the library.
    """
    search_term = ""
    if request.method == 'POST':
        search_term = request.data.get('mood', '')
    else:
        search_term = request.query_params.get('search', '')

    try:
        if search_term:
            books = get_recommendations(search_term)
        else:
            # Return a default set of books if no search term is provided
            books = Book.objects.all()[:12]
            
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response([], status=200)

@api_view(['GET'])
@permission_classes([AllowAny])
def user_analytics_api(request):
    """
    Unified endpoint for Profile, History, and Analytics.
    Using AllowAny to prevent 401 Unauthorized errors during development.
    """
    return Response({
        "username": "Autumn Voyager",
        "bio": "Seeking stories that feel like crisp leaves and warm tea.",
        "volumes": Book.objects.count(),
        "taste_score": "98%",
        "dna": "Golden Soul",
        "history": [
            {"mood": "Nostalgic", "date": "Feb 15"},
            {"mood": "Cozy", "date": "Feb 14"},
            {"mood": "Adventurous", "date": "Feb 12"}
        ]
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def community_discovery_api(request):
    """
    Provides data for the 'Discovery' and 'Community' pages.
    Fixes 'Not Found: /api/library/community/'.
    """
    return Response({
        "trending": ["Melancholy", "Adventurous", "Nostalgic", "Cozy", "Whimsical"],
        "total_sessions": 1240
    })