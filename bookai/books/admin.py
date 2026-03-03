from django.contrib import admin
from .models import Book

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'publication_year')
    search_fields = ('title', 'author')
    filter_horizontal = ('moods',) # This allows you to select Moods easily


from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    # What columns to show in the list view
    list_display = ('title', 'author', 'category', 'created_at')
    
    # Add a sidebar for filtering by category or date
    list_filter = ('category', 'created_at', 'author')
    
    # Add a search bar for titles and content
    search_fields = ('title', 'content')
    
    # Make the date read-only so it can't be forged
    readonly_fields = ('created_at',)
    
    # Organize the detail view into sections
    fieldsets = (
        ('Article Details', {
            'fields': ('title', 'author', 'category')
        }),
        ('Content', {
            'fields': ('content',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',) # Hide this by default
        }),
    )