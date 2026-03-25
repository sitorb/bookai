from django.db.models import Q
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from .models import Book, Article, Collection
from .serializers import BookSerializer, ArticleSerializer, CollectionSerializer
from .services import generate_ai_metadata

# ==========================================
# 1. THE DISCOVERY HALL (Books & Oracle)
# ==========================================

class BookDiscoveryView(generics.ListAPIView):
    """Handles searching and filtering the main library."""
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Book.objects.all()
        query = self.request.query_params.get('q')
        category = self.request.query_params.get('category')

        if query:
            # Searching by title, author, or the AI-generated summary
            queryset = queryset.filter(
                Q(title__icontains=query) | 
                Q(author__icontains=query) | 
                Q(summary__icontains=query)
            )
        
        if category:
            queryset = queryset.filter(category__iexact=category)
            
        return queryset

@api_view(['GET'])
def random_book(request):
    """The Oracle: Returns one random volume from the shelves."""
    book = Book.objects.order_by('?').first()
    if book:
        serializer = BookSerializer(book)
        return Response(serializer.data)
    
    # Return a 200 with a message instead of a 404 to help the frontend handle empty states
    return Response({"message": "The library shelves are currently empty."}, status=200)


# ==========================================
# 2. THE JOURNAL (Articles & Likes)
# ==========================================
class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # 1. Consult the AI Librarian before saving
        content = self.request.data.get('content', '')
        note, tags = generate_ai_metadata(content)
        
        # 2. Save with the AI's contributions and the current user
        serializer.save(
            author=self.request.user,
            archivist_note=note,
            ai_tags=tags
        )

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View, edit, or burn (delete) a specific journal entry."""
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ToggleLikeView(generics.GenericAPIView):
    """Allows a user to 'heart' an article."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            article = Article.objects.get(pk=pk)
            if request.user in article.likes.all():
                article.likes.remove(request.user)
                return Response({"is_liked": False, "count": article.likes.count()})
            else:
                article.likes.add(request.user)
                return Response({"is_liked": True, "count": article.likes.count()})
        except Article.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# ==========================================
# 3. THE NOOKS (User Bookshelves)
# ==========================================

class CollectionViewSet(viewsets.ModelViewSet):
    """Personal reading nooks for curating articles."""
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Privacy first: Users only see their own nooks
        return Collection.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_article(self, request, pk=None):
        """Custom endpoint to toss an article onto a specific shelf."""
        collection = self.get_object()
        article_id = request.data.get('article_id')
        
        if not article_id:
            return Response({"error": "No article ID provided"}, status=400)
            
        collection.articles.add(article_id)
        return Response({'status': f'Article {article_id} added to {collection.name}'}, status=200)


# ==========================================
# 4. THE ARCHIVIST'S DASHBOARD (Stats)
# ==========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_stats(request):
    """Returns total counts for the user's contributions."""
    user = request.user
    return Response({
        "username": user.username,
        "articles_count": user.articles.count(),
        "nooks_count": user.collections.count(),
        "total_likes_received": sum(a.likes.count() for a in user.articles.all())
    })