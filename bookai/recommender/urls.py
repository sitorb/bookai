from django.urls import path
from .views import get_recommendations, my_recommendations, RecommendationHistoryView, RecommendationAnalyticsView
from .views import get_history

urlpatterns = [
    path("recommend/", get_recommendations, name="recommend"),
    path("my-recommendations/", my_recommendations),
    path("recommendations/analytics/", RecommendationAnalyticsView.as_view(), name="recommendation_analytics"),
    path("history/", get_history),
    path("recommendations/history/", RecommendationHistoryView.as_view(), name="recommendation_history"),

]
