from django.urls import path
from .views import RecommendView, RecommendationHistoryView, FavoriteView, FavoriteListView

urlpatterns = [
    path("recommend/", RecommendView.as_view(), name="recommend"),
    path("history/", RecommendationHistoryView.as_view(), name="history"),
    path("favorites/", FavoriteListView.as_view(), name="favorites"),
    path("favorites/add/", FavoriteView.as_view(), name="add_favorite"),
]
