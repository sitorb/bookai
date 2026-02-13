import csv
from django.core.management.base import BaseCommand
from books.models import Book

class Command(BaseCommand):
    help = 'Imports books from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str)

    def handle(self, *args, **options):
        with open(options['csv_file'], encoding='utf-8') as f:
            reader = csv.DictReader(f)
            books_to_create = []
            for row in reader:
                # Basic cleaning: ensure description isn't empty
                if row.get('description'):
                    books_to_create.append(Book(
                        title=row['title'],
                        author=row['author'],
                        summary=row['description']
                    ))
            
            # Bulk create is 100x faster than saving one by one
            Book.objects.bulk_create(books_to_create, ignore_conflicts=True)
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {len(books_to_create)} books'))