from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'summary', 'cover_image'] # проверьте поля в вашей модели!


from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.username')
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'author_name', 'category', 'content', 'created_at', 'likes_count', 'is_liked', 'ai_tags', 'archivist_note']

    def get_is_liked(self, obj):
        # 1. Get the request from the context
        request = self.context.get('request')
        
        # 2. Check if the user is logged in and if they are in the 'likes' list
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
            
        return False