import json
import os
import django
from django.db import transaction

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book

def import_books(file_path):
    print("📦 Начинаю импорт обложек и описаний...")
    books_to_create = []
    
    # Чтобы не плодить дубликаты
    existing_titles = set(Book.objects.values_list('title', flat=True))

    with open(file_path, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            try:
                data = json.loads(line)
                title = data.get('title', 'Unknown')

                if not title or title in existing_titles:
                    continue

                # БЕЗОПАСНОЕ извлечение автора
                authors_list = data.get('authors', [])
                if authors_list and len(authors_list) > 0:
                    author_name = authors_list[0].get('name', 'Unknown')
                else:
                    author_name = 'Unknown'

                # Безопасное извлечение картинки
                img = data.get('image_url') or data.get('url')
                if img and ('nophoto' in img or not img.startswith('http')):
                    img = None

                book = Book(
                    title=str(title)[:255],
                    author=str(author_name)[:255],
                    summary=data.get('description', 'No description available.'),
                    publication_year=int(data.get('publication_year')) if data.get('publication_year') else None,
                    image_url=img
                )
                books_to_create.append(book)

                # Сохраняем пачками
                if len(books_to_create) >= 1000:
                    Book.objects.bulk_create(books_to_create)
                    books_to_create = []
                    print(f"✅ Обработано строк: {i+1}...")

            except Exception as e:
                print(f"⚠️ Ошибка в строке {i}: {e}")
                continue

        # Дозаписываем остатки
        if books_to_create:
            Book.objects.bulk_create(books_to_create)

    print(f"🏁 Готово! Теперь в базе {Book.objects.count()} книг.")

if __name__ == '__main__':
    import_books('data/goodreads_books.json')