from django.db import models

class RecommendationHistory(models.Model):
    input_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class RecommendedBook(models.Model):
    history = models.ForeignKey(RecommendationHistory, related_name="books", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    reason = models.TextField()

class FavoriteBook(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
