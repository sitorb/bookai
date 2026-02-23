import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book

def clean_my_library():
    count = Book.objects.count()
    print(f"🔎 Сейчас в базе: {count} книг.")
    
    if count > 20000:
        print("🧹 Начинаю удаление лишних 2.3 миллионов строк... Подожди минуту.")
        # Оставляем только первые 20 000 книг
        first_20k_ids = Book.objects.values_list('id', flat=True)[:20000]
        Book.objects.exclude(id__in=list(first_20k_ids)).delete()
        print(f"✨ Готово! Теперь в базе уютные {Book.objects.count()} книг.")
    else:
        print("База уже в норме.")

if __name__ == '__main__':
    clean_my_library()