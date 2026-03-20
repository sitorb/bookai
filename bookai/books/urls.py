# file: books/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'nooks', views.CollectionViewSet, basename='nook')

urlpatterns = [
    # Router URLs (for the nooks)
    path('', include(router.urls)),
    
    # Discovery URLs
    path('discovery/', views.BookDiscoveryView.as_view(), name='discovery'),
    path('discovery/random/', views.random_book, name='random-book'), # <--- CHECK THIS LINE
    
    # Profile & Journal URLs
    path('profile/stats/', views.user_profile_stats, name='user-stats'),
    path('articles/', views.ArticleListCreateView.as_view(), name='article-list'),
    path('articles/<int:pk>/', views.ArticleDetailView.as_view(), name='article-detail'),
    path('articles/<int:pk>/like/', views.ToggleLikeView.as_view(), name='article-like'),
]