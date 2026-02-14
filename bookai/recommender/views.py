# recommender/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from books.models import Book, Mood
from books.serializers import BookSerializer

class RecommendBookView(APIView):
    def post(self, request):
        user_input = request.data.get('query', '').lower()
        
        # Simple Logic: Map keywords to our Mood names
        # Later, we will replace this with real AI (BERT/LLM)
        mood_map = {
            "sad": "Melancholic",
            "lonely": "Melancholic",
            "happy": "Inspiring",
            "motivated": "Inspiring",
            "scared": "Dystopian",
            "curious": "Philosophical",
            "chill": "Cozy"
        }

        # Find the matching mood
        target_mood = None
        for keyword, mood_name in mood_map.items():
            if keyword in user_input:
                target_mood = mood_name
                break

        if target_mood:
            books = Book.objects.filter(moods__name=target_mood)
        else:
            # Fallback: if no mood found, show random books
            books = Book.objects.all()[:2]

        serializer = BookSerializer(books, many=True)
        return Response({
            "detected_mood": target_mood,
            "recommendations": serializer.data
        })
    
