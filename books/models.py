from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    era = models.CharField(max_length=100, blank=True)
    complexity_level = models.IntegerField(default=3)
    cover_image = models.URLField(blank=True)
    #moods = models.ManyToManyField(Mood, related_name="books", blank=True)
    tags = models.ManyToManyField("Tag", blank=True)

    def __str__(self):
        return f"{self.title} — {self.author}"


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
