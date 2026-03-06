import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from books.models import Book
from library.recommender import get_recommendations

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

    # Логируем для проверки в терминале
    print(f"DEBUG: Поиск для '{query}'")
    recommended_books = get_recommendations(str(query))
    
    results = []
    # Определяем базовый адрес сервера для полных путей к картинкам
    domain = request.build_absolute_uri('/')[:-1] 

    for book in recommended_books:
        # Проверяем наличие обложки в разных полях
        cover = None
        if hasattr(book, 'cover_image') and book.cover_image:
            cover = f"{domain}{book.cover_image.url}"
        elif hasattr(book, 'image_url') and book.image_url:
            cover = book.image_url # Если это внешняя ссылка

        results.append({
            'id': book.id,
            'title': book.title,
            'author': getattr(book, 'author', 'Unknown'),
            'summary': (book.summary or "No description available....")[:250] + "...",
            'cover_image': cover,
            'publication_year': getattr(book, 'publication_year', '')
        })

    print(f"DEBUG: Отправлено книг: {len(results)}")
    return JsonResponse(results, safe=False)


from rest_framework import generics, permissions
from .models import Article
from .serializers import ArticleSerializer

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    
    # Allows guests to see articles, but keeps track of user ID for the "is_liked" status
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

        
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Article

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