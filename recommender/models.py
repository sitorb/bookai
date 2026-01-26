from django.db import models
from django.conf import settings
from books.models import Book

class Recommendation(models.Model):
    CONTEXT_CHOICES = [
        ("feel", "I feel..."),
        ("want", "I want to feel..."),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    context_type = models.CharField(max_length=10, choices=CONTEXT_CHOICES)
    user_input = models.TextField()
    reason = models.TextField()
    confidence_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)


from django.conf import settings

class RecommendationHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recommender_histories"
    )
    input_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
