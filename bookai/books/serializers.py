from rest_framework import serializers
from .models import Book, Article, Collection

# --- 1. Book Serializer ---
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        # Ensure these fields match your models.py exactly!
        fields = ['id', 'title', 'author', 'summary', 'cover_image']

# --- 2. Article (Journal) Serializer ---
class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'author_name', 'category', 'content', 
            'created_at', 'likes_count', 'is_liked', 'ai_tags', 'archivist_note'
        ]

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

# --- 3. Collection (Nook) Serializer ---
class CollectionSerializer(serializers.ModelSerializer):
    # This nests the full article data inside the collection response
    articles = ArticleSerializer(many=True, read_only=True) 

    class Meta:
        model = Collection
        fields = ['id', 'name', 'articles', 'created_at']