from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSets (like your Collection/Nook view)
router = DefaultRouter()
router.register(r'nooks', views.CollectionViewSet, basename='nook')

urlpatterns = [
    # 1. Router URLs (This handles /api/nooks/)
    path('', include(router.urls)),
    
    # 2. Oracle / Discovery URLs
    # This must come BEFORE the general 'discovery/' path if there's any conflict
    path('discovery/random/', views.random_book, name='random-book'),
    path('discovery/', views.BookDiscoveryView.as_view(), name='discovery'),
    
    # 3. Recommendation Legacy URL (if your frontend uses /api/recommend/)
    path('recommend/', views.recommend_books_api, name='recommend'),

    # 4. Articles & Stats
    path('profile/stats/', views.user_profile_stats, name='user-stats'),
    path('articles/', views.ArticleListCreateView.as_view(), name='article-list'),
    path('articles/<int:pk>/', views.ArticleDetailView.as_view(), name='article-detail'),
    path('articles/<int:pk>/like/', views.ToggleLikeView.as_view(), name='article-like'),
]