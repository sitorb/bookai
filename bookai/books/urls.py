from django.urls import path
from .views import recommend_books_api
from .views import ArticleListCreateView, ArticleDetailView

urlpatterns = [
    # Simplest path to get the command running
    path('recommend/', recommend_books_api),
    path('api/articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('api/articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
]