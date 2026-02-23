import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book

print(f"📊 Total books in DB: {Book.objects.count()}")
first_book = Book.objects.first()
if first_book:
    print(f"📖 Sample Book: {first_book.title} by {first_book.author}")
    print(f"📝 Summary length: {len(first_book.summary or '')} chars")
else:
    print("❌ Database is completely empty!")