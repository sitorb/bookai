import json
import os
import django
from django.db import transaction, IntegrityError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book, Mood

MOOD_MAP = {
    'Melancholic': ['sad', 'tragedy', 'loss', 'death', 'lonely', 'nostalgia', 'dark', 'depressing', 'grief'],
    'Inspiring': ['hope', 'dream', 'success', 'growth', 'motivation', 'triumph', 'inspiring'],
    'Cozy': ['warm', 'sweet', 'home', 'family', 'gentle', 'peaceful', 'comfort', 'bakery'],
    'Intellectual': ['philosophy', 'science', 'complex', 'theory', 'history', 'psychology'],
    'Adventurous': ['journey', 'quest', 'exploration', 'action', 'mystery', 'wild', 'magic']
}

def get_mood_ids(text, mood_objs):
    text = text.lower()
    return [mood_objs[m].id for m in MOOD_MAP if any(word in text for word in MOOD_MAP[m])]

def import_all_books(file_path, limit=10000):
    print(f"🚀 Начинаем безопасный импорт...")
    
    mood_objs = {m.name: m for m in Mood.objects.all()}
    if not mood_objs:
        print("❌ Сначала создайте Moods через seed_books.py!")
        return

    books_to_create = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= limit: break
            
            try:
                data = json.loads(line)
                
                # Тщательная очистка данных для предотвращения ошибок БД
                title = str(data.get('title', 'Unknown'))[:254]
                summary = data.get('description', '')
                if not summary or len(summary) < 20: continue

                author_data = data.get('authors', [])
                author_name = "Unknown"
                if author_data:
                    author_name = str(author_data[0].get('name', 'Unknown'))[:254]

                year = data.get('publication_year')
                try:
                    year = int(year) if year else None
                except ValueError:
                    year = None

                book_obj = Book(
                    title=title,
                    author=author_name,
                    summary=summary,
                    publication_year=year
                )
                books_to_create.append(book_obj)

                # Сохраняем пачками по 500 для стабильности
                if len(books_to_create) >= 500:
                    save_batch(books_to_create, mood_objs)
                    books_to_create = []
                    print(f"✅ Обработано {i+1} строк...")

            except Exception as e:
                # Ошибка в одной строке JSON не сломает весь скрипт
                continue

        # Сохраняер остаток
        if books_to_create:
            save_batch(books_to_create, mood_objs)

    print(f"🏁 Готово! Книг в базе: {Book.objects.count()}")

def save_batch(batch, mood_objs):
    """ Сохраняет пачку книг и их настроения в отдельной транзакции """
    try:
        with transaction.atomic():
            created_books = Book.objects.bulk_create(batch)
            
            links = []
            for b in created_books:
                m_ids = get_mood_ids(f"{b.title} {b.summary}", mood_objs)
                for mid in m_ids:
                    links.append(Book.moods.through(book_id=b.id, mood_id=mid))
            
            if links:
                Book.moods.through.objects.bulk_create(links, ignore_conflicts=True)
    except Exception as e:
        print(f"⚠️ Пропущена пачка из-за ошибки: {e}")

if __name__ == '__main__':
    # Убедись, что путь к файлу верный
    path = os.path.join('data', 'goodreads_books.json')
    import_all_books(path)