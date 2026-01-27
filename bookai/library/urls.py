from django.urls import path
from . import views
urlpatterns = [
    path("favorites/add/", views.add_to_favorites),
    path("favorites/remove/", views.remove_from_favorites),
    path("favorites/", views.list_favorites),
]
