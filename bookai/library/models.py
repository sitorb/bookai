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
