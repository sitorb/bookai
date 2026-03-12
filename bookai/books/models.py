from django.db import models

class Mood(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    summary = models.TextField()
    publication_year = models.IntegerField(null=True, blank=True)
    image_url = models.URLField(max_length=500, null=True, blank=True) # Добавь это
    # This is the line that was likely causing the error
    moods = models.ManyToManyField(Mood, related_name='books')

    def __str__(self):
        return f"{self.title} - {self.author}"
    
from django.db import models
from django.conf import settings  # <--- 1. Import settings

class Article(models.Model):
    CATEGORY_CHOICES = [
        ('Literary Theory', 'Literary Theory'),
        ('Technology', 'Technology'),
        ('History', 'History'),
        ('Community Discovery', 'Community Discovery'),
    ]

    title = models.CharField(max_length=255)
    
    # 2. Change 'User' to settings.AUTH_USER_MODEL
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='articles'
    )
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Literary Theory')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    ai_tags = models.CharField(max_length=255, blank=True, null=True)
    archivist_note = models.TextField(blank=True, null=True) # The AI summary

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.author.username}"
    
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='liked_articles', 
        blank=True
    )

    def total_likes(self):
        return self.likes.count()
    


class Collection(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='collections')
    articles = models.ManyToManyField('Article', related_name='in_collections', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"