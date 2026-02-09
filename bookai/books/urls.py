from django.urls import path
from . import views
from .views import ToggleFavoriteView

urlpatterns = [
    path("books/", views.book_list, name="book_list"),
    path('favorite/<int:book_id>/', ToggleFavoriteView.as_view(), name='toggle-favorite'),
]
