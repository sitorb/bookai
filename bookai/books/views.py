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
    



# books/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Collection, Article
from .serializers import CollectionSerializer

class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users only see their own Nooks
        return Collection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_article(self, request, pk=None):
        collection = self.get_object()
        article_id = request.data.get('article_id')
        article = get_object_or_404(Article, id=article_id)

        if article in collection.articles.all():
            collection.articles.remove(article)
            return Response({'status': 'removed'}, status=status.HTTP_200_OK)
        else:
            collection.articles.add(article)
            return Response({'status': 'added'}, status=status.HTTP_200_OK)


# books/views.py
from django.db.models import Q
from rest_framework.views import APIView
from .models import Book # Assuming your core book model is named Book

class BookDiscoveryView(APIView):
    def get(self, request):
        query = request.query_params.get('search', '')
        category = request.query_params.get('category', '')
        
        books = Book.objects.all()
        
        if query:
            books = books.filter(
                Q(title__icontains=query) | 
                Q(author__icontains=query) |
                Q(description__icontains=query)
            )
            
        if category:
            books = books.filter(category__iexact=category)

        # Let's return the top 20 matches
        serializer = BookSerializer(books[:20], many=True)
        return Response(serializer.data)


# books/views.py
import random
from rest_framework.decorators import api_view
from .models import Book


@api_view(['GET'])
def random_book(request):
    # order_by('?') is great for small/medium datasets. 
    # It picks one random record from the library.
    book = Book.objects.order_by('?').first()
    
    if book:
        serializer = BookSerializer(book)
        return Response(serializer.data)
    return Response({"error": "The library is empty."}, status=404)



# books/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Article, Collection

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_stats(request):
    user = request.user
    
    # Gathering the scholar's data
    manuscripts_count = Article.objects.filter(author=user).count()
    nooks_count = Collection.objects.filter(user=user).count()
    
    # Archival Impact (Total likes received on their articles)
    total_impact = sum(article.likes.count() for article in Article.objects.filter(author=user))

    return Response({
        "username": user.username,
        "date_joined": user.date_joined.strftime("%B %Y"),
        "manuscripts_count": manuscripts_count,
        "nooks_count": nooks_count,
        "total_impact": total_impact,
    })