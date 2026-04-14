from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as authtoken_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', authtoken_views.obtain_auth_token),
    path('api/users/', include('users.urls')),
    path('api/books/', include('books.urls')),
    path('api/library/', include('library.urls')),
]