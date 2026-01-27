from django.db import models
from django.conf import settings

class RecommendationHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mood_histories"
    )
    input_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class RecommendedBook(models.Model):
    history = models.ForeignKey(RecommendationHistory, related_name="books", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    reason = models.TextField()


class FavoriteBook(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
