from django.contrib import admin  # <--- THIS IS THE MISSING LINE
from django.urls import path, include
from rest_framework.authtoken import views # Add this import

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/recommend/', include('recommender.urls')),
    path('api/token/', views.obtain_auth_token), # Add this line to fix the 404
]