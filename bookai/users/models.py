from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# 1. Define your Custom User Model first
class User(AbstractUser):
    """
    Custom user model where 'auth.User' is swapped for 'users.User'.
    This resolves the AttributeError and ensures your app uses this model.
    """
    pass

# 2. Define the Profile model linking to the User model
class Profile(models.Model):
    # Using settings.AUTH_USER_MODEL is best practice for custom users
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username
    

# users/models.py
class SearchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    query_text = models.TextField()
    detected_mood = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp'] # Newest first