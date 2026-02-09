# recommender/models.py
from django.db import models
from django.conf import settings
from books.models import Book

class Recommendation(models.Model):  # Make sure it's not 'RecommendationHistory'
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    context_provided = models.TextField()
    why_recommended = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"