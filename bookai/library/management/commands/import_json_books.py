import json
import os
from django.core.management.base import BaseCommand
from books.models import Book

# ⛔️ WARNING: The class name MUST be 'Command'
class Command(BaseCommand):
    help = 'Imports high-quality books from the Goodreads JSON file'

    def handle(self, *args, **options):
        # We look for the file in the /data/ folder relative to manage.py
        file_path = os.path.join('data', 'goodreads_books.json')
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"Critical Error: File not found at {file_path}"))
            return

        books_to_add = []
        self.stdout.write("Reading the library... please wait.")

        with open(file_path, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                # Start with 1,000 books to verify quality first
                if i >= 1000: break
                
                try:
                    data = json.loads(line)
                    desc = data.get('description', '')
                    
                    # Only add if it's a "premium" entry with a long summary
                    if data.get('title') and len(desc) > 300:
                        books_to_add.append(Book(
                            title=data['title'],
                            author="Goodreads Librarian",
                            summary=desc
                        ))
                except Exception:
                    continue

        # Bulk save is 100x faster than individual saves
        Book.objects.bulk_create(books_to_add, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f'Success! {len(books_to_add)} books are now in your database.'))