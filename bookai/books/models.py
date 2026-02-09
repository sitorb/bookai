from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    summary = models.TextField()
    publication_year = models.IntegerField(null=True, blank=True)
    
    # We will link moods later once that model is updated
    moods = models.ManyToManyField('moods.Mood', related_name='books')

    def __str__(self):
        return f"{self.title} - {self.author}"