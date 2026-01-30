from django.db import models
from django.conf import settings


class Recommendation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    book = models.ForeignKey("books.Book", on_delete=models.CASCADE)
    reason = models.TextField()
    confidence_score = models.FloatField(default=0.5)
    context_type = models.CharField(max_length=50, default="feel")
    created_at = models.DateTimeField(auto_now_add=True)


class RecommendationHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    input_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
