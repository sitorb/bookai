# books/serializers.py
from rest_framework import serializers
from .models import Book, Mood

class MoodSerializer(serializers.ModelSerializer):
    class __all__:
        model = Mood
        fields = ['name', 'description']

class BookSerializer(serializers.ModelSerializer):
    moods = MoodSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'summary', 'moods']