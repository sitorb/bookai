# file: books/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# 1. Routers are only for ViewSets (like CollectionViewSet)
router = DefaultRouter()
router.register(r'nooks', views.CollectionViewSet, basename='nook')
# file: books/urls.py

urlpatterns = [
    # 1. Oracle / Discovery URLs
    path('discovery/random/', views.random_book, name='random-book'), # <--- ADD THIS LINE
    path('discovery/', views.BookDiscoveryView.as_view(), name='discovery'),
    
    # 2. Include the router paths
    path('', include(router.urls)),

    # 3. Other endpoints
    path('profile/stats/', views.user_profile_stats, name='user-stats'),
    path('articles/', views.ArticleListCreateView.as_view(), name='article-list'),
]