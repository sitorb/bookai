import json
import random
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from rest_framework import generics, permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
# Local Imports
from .models import Book, Article, Collection
from .serializers import ArticleSerializer, CollectionSerializer, BookSerializer
from .services import generate_bibliographic_tags, generate_archivist_note
from library.recommender import get_recommendations

# --- 1. Permissions ---
class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

# --- 2. Article / Journal Views ---
class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        content = self.request.data.get('content', '')
        # The Librarian performs two tasks using AI:
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
        return Response({'liked': liked, 'count': article.total_likes()}, status=status.HTTP_200_OK)

# --- 3. Discovery & Oracle Views ---
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

        serializer = BookSerializer(books[:20], many=True)
        return Response(serializer.data)

# file: books/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

@api_view(['GET'])
def random_book(request):
    # Picking a random volume from the shelves
    book = Book.objects.order_by('?').first()
    if book:
        serializer = BookSerializer(book)
        return Response(serializer.data)
    
    # If the library is empty, the Oracle is indeed silent
    return Response({"message": "The library shelves are currently empty."}, status=200)
# --- 4. Library / Nook Views ---
class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
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

# --- 5. Scholar Stats ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_stats(request):
    user = request.user
    manuscripts_count = Article.objects.filter(author=user).count()
    nooks_count = Collection.objects.filter(user=user).count()
    total_impact = sum(article.likes.count() for article in Article.objects.filter(author=user))

    return Response({
        "username": user.username,
        "date_joined": user.date_joined.strftime("%B %Y"),
        "manuscripts_count": manuscripts_count,
        "nooks_count": nooks_count,
        "total_impact": total_impact,
    })

# --- 6. Legacy Recommendation API ---
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

    recommended_books = get_recommendations(str(query))
    results = []
    domain = request.build_absolute_uri('/')[:-1] 

    for book in recommended_books:
        cover = getattr(book, 'image_url', None)
        if hasattr(book, 'cover_image') and book.cover_image:
            cover = f"{domain}{book.cover_image.url}"

        results.append({
            'id': book.id,
            'title': book.title,
            'author': getattr(book, 'author', 'Unknown'),
            'summary': (book.summary or "No description available....")[:250] + "...",
            'cover_image': cover,
            'publication_year': getattr(book, 'publication_year', '')
        })
    return JsonResponse(results, safe=False)