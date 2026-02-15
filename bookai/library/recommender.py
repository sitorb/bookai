from rest_framework.decorators import api_view
from rest_framework.response import Response
from books.models import Book
from .serializers import BookSerializer
from library.recommender import get_recommendations

@api_view(['POST'])
def recommend_books_api(request):
    user_mood = request.data.get('mood', '')
    if not user_mood:
        return Response({"error": "No mood provided"}, status=400)

    try:
        # The AI Engine in action
        recommended_objects = get_recommendations(user_mood)
        serializer = BookSerializer(recommended_objects, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(f"AI Error: {e}")
        return Response({"error": "AI brain is still loading..."}, status=500)

@api_view(['GET'])
def user_profile_api(request):
    # This fixes the 'Session expired' error for new users
    return Response({
        "username": "Reader",
        "bio": "Searching for the perfect story...",
        "volumes": 0,
        "taste_score": "Awaiting data...",
        "dna": "New Soul",
        "history": []
    })