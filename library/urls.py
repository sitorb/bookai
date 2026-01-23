from django.urls import path
from .views import AddToFavoritesView, RemoveFromFavoritesView, ListFavoritesView


urlpatterns = [
    path("favorites/add/", AddToFavoritesView.as_view()),
    path("favorites/remove/", RemoveFromFavoritesView.as_view()),
    path("favorites/", ListFavoritesView.as_view()),
]