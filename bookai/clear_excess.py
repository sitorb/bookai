import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book

def prune_database():
    total = Book.objects.count()
    if total > 20000:
        print(f"🧹 В базе {total} книг. Начинаю чистку...")
        # Оставляем только первые 20 000 ID
        keep_ids = Book.objects.values_list('id', flat=True)[:20000]
        # Удаляем всё остальное
        Book.objects.exclude(id__in=list(keep_ids)).delete()
        print(f"✅ Готово! Теперь в базе {Book.objects.count()} книг. Система будет летать!")
    else:
        print("База уже в порядке.")

if __name__ == '__main__':
    prune_database()