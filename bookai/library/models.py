from django.db import models
from django.conf import settings
from books.models import Book

class ReadingList(models.Model):
    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("reading", "Reading"),
        ("finished", "Finished"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "book")
# library/models.py
from django.db import models
from django.conf import settings
from books.models import Book

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='book_favorites') # Changed name
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"