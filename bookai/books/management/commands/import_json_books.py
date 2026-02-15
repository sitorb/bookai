import json
import os
from django.core.management.base import BaseCommand
from books.models import Book

class Command(BaseCommand):
    help = 'Imports 5,000 high-quality books with real metadata'

    def handle(self, *args, **options):
        file_path = os.path.join('data', 'goodreads_books.json')
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR("File not found!"))
            return

        books_to_add = []
        with open(file_path, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                if len(books_to_add) >= 5000: break # Increased to 5k
                
                try:
                    data = json.loads(line)
                    desc = data.get('description', '')
                    # Filter for quality: must have a title and a decent summary
                    if data.get('title') and len(desc) > 300:
                        books_to_add.append(Book(
                            title=data['title'],
                            # Try to find author, fallback to 'Unknown'
                            author=data.get('author_name', 'Unknown Author'),
                            summary=desc
                        ))
                except:
                    continue

        Book.objects.bulk_create(books_to_add, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f'Imported {len(books_to_add)} books!'))