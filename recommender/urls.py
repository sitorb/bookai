from django.urls import path
from .views import get_recommendations, my_recommendations

urlpatterns = [
    path("recommend/", get_recommendations),
    path("my-recommendations/", my_recommendations),
]
