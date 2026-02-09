# recommender/urls.py
from django.urls import path
from .views import RecommendBookView

urlpatterns = [
    path('suggest/', RecommendBookView.as_view(), name='recommend-book'),
]