from django.urls import path
from .views import get_recommendations, get_history

urlpatterns = [
    path("recommend/", get_recommendations),
    path("history/", get_history),
]
