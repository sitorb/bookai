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
    
