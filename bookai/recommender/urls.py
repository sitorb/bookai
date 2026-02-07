from django.urls import path
from .views import get_recommendations, get_history

urlpatterns = [
    path("", get_recommendations),
    path("history/", get_history),
]
