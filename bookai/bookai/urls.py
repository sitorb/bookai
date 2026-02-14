from django.contrib import admin  # <--- THIS IS THE MISSING LINE
from django.urls import path, include
from rest_framework.authtoken import views # Add this import
from books.views import recommend_books_api
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/recommend/', include('recommender.urls')),
    path('api/token/', views.obtain_auth_token),
    path('api/users/', include('users.urls')), # Points to your register view
    path('api/books/', include('books.urls')),
    path('api/library/', include('library.urls')),
    path('api/recommend/', recommend_books_api, name='recommend_api'),
]