import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import generate_bibliographic_tags, generate_archivist_note
from .models import Book, Article
from .serializers import ArticleSerializer
from library.recommender import get_recommendations
from .services import generate_ai_metadata  # Updated service import

# --- Recommendation API (Function Based) ---
@csrf_exempt
def recommend_books_api(request):
    query = ""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get('mood') or data.get('query', '')
        except:
            query = request.POST.get('mood', '')
    
    if not query:
        return JsonResponse([], safe=False)

    print(f"DEBUG: Search for '{query}'")
    recommended_books = get_recommendations(str(query))
    
    results = []
    domain = request.build_absolute_uri('/')[:-1] 

    for book in recommended_books:
        cover = None
        if hasattr(book, 'cover_image') and book.cover_image:
            cover = f"{domain}{book.cover_image.url}"
        elif hasattr(book, 'image_url') and book.image_url:
            cover = book.image_url 

        results.append({
            'id': book.id,
            'title': book.title,
            'author': getattr(book, 'author', 'Unknown'),
            'summary': (book.summary or "No description available....")[:250] + "...",
            'cover_image': cover,
            'publication_year': getattr(book, 'publication_year', '')
        })

    return JsonResponse(results, safe=False)

# --- Permissions ---
class IsAuthorOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object to edit or delete it."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

# --- Article Views ---

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        content = self.request.data.get('content', '')
        
        # 1. Ask the AI Librarian (Gemini) for a note and tags
        note, tags = generate_ai_metadata(content)
        
        # 2. Save with the generated metadata
        serializer.save(
            author=self.request.user, 
            archivist_note=note, 
            ai_tags=tags
        )

    def perform_create(self, serializer):
        content = self.request.data.get('content', '')
        
        # The Librarian performs two tasks:
        tags = generate_bibliographic_tags(content)
        note = generate_archivist_note(content)
        
        serializer.save(
            author=self.request.user, 
            ai_tags=tags,
            archivist_note=note
        )

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

class ToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        user = request.user
        
        if user in article.likes.all():
            article.likes.remove(user)
            liked = False
        else:
            article.likes.add(user)
            liked = True
            
        return Response({
            'liked': liked,
            'count': article.total_likes()
        }, status=status.HTTP_200_OK)