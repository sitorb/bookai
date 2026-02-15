from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer # Corrected import path
from library.recommender import get_recommendations

@api_view(['POST'])
@permission_classes([AllowAny])
def recommend_books_api(request):
    user_mood = request.data.get('mood', '')
    if not user_mood:
        return Response({"error": "No mood provided"}, status=400)

    try:
        recommended_objects = get_recommendations(user_mood)
        serializer = BookSerializer(recommended_objects, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def user_analytics_api(request):
    """Stops the 401 Unauthorized errors on the Profile page"""
    return Response({
        "books_read": 0,
        "favorite_genre": "Discovering...",
        "reading_streak": 0,
        "reader_dna": "Autumn Soul"
    })