from django.contrib import admin  # <--- THIS IS THE MISSING LINE
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Temporarily keep these commented out until we fix their views.py
    # path("api/recommend/", include("recommender.urls")),
]