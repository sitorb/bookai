from django.urls import path
from .views import register_user, clear_search_history, reader_analytics

urlpatterns = [
    path("register/", register_user, name="register"),
    path('history/clear/', clear_search_history, name='clear-history'),
    path('analytics/', reader_analytics),
]
