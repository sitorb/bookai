from django.http import JsonResponse
from .models import Book
import json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def book_list(request):
    if request.method == "GET":
        books = Book.objects.all()
        data = [{"id": b.id, "title": b.title, "author": b.author} for b in books]
        return JsonResponse({"books": data})

    if request.method == "POST":
        data = json.loads(request.body)
        book = Book.objects.create(
            title=data["title"],
            author=data["author"],
            description=data.get("description", "")
        )
        return JsonResponse({"id": book.id, "title": book.title, "author": book.author}, status=201)

# books/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Book

class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated] # User must be logged in

    def post(self, request, book_id):
        try:
            book = Book.objects.get(id=book_id)
            favorite, created = Favorite.objects.get_or_create(user=request.user, book=book)
            
            if not created:
                # If it already exists, clicking again "un-favorites" it
                favorite.delete()
                return Response({"message": "Removed from favorites"}, status=status.HTTP_200_OK)
            
            return Response({"message": "Added to favorites"}, status=status.HTTP_201_CREATED)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
        

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer # Ensure you have a serializer
from library.recommender import get_recommendations

@api_view(['POST'])
def recommend_books_api(request):
    # Get the mood from the frontend (React)
    user_mood = request.data.get('mood', '')
    
    if not user_mood:
        return Response({"error": "No mood provided"}, status=400)

    # 🚀 The AI Engine in action
    recommended_objects = get_recommendations(user_mood, top_k=6)
    
    # Turn the book objects into JSON for the frontend
    serializer = BookSerializer(recommended_objects, many=True)
    return Response(serializer.data)