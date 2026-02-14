import json
import os
from django.core.management.base import BaseCommand
from books.models import Book

print("--- DEBUG: Django is now loading the import_json_books file ---")

class Command(BaseCommand):
    help = 'Imports high-quality books from the data folder'

    def handle(self, *args, **options):
        # Path: bookai/data/goodreads_books.json
        file_path = os.path.join('data', 'goodreads_books.json')
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        books_to_add = []
        self.stdout.write("Reading JSON entries...")

        with open(file_path, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                if i >= 1000: break # Small batch for testing
                
                try:
                    data = json.loads(line)
                    desc = data.get('description', '')
                    
                    if data.get('title') and len(desc) > 200:
                        books_to_add.append(Book(
                            title=data['title'],
                            author="System",
                            summary=desc
                        ))
                except:
                    continue

        Book.objects.bulk_create(books_to_add, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f'Done! Imported {len(books_to_add)} books.'))