from django.urls import path, include

urlpatterns = [
    path("api/recommend/", include("recommender.urls")),
]
