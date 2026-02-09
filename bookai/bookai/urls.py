from django.contrib import admin  # <--- THIS IS THE MISSING LINE
from django.urls import path, include

# bookai/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/recommend/', include('recommender.urls')),
]