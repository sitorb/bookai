import json
import os
import django
from django.db import transaction

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book, Mood

# Карта настроений (можно расширить)
MOOD_MAP = {
    'Melancholic': ['sad', 'tragedy', 'loss', 'death', 'lonely', 'nostalgia', 'dark', 'depressing'],
    'Inspiring': ['hope', 'dream', 'success', 'growth', 'motivation', 'triumph', 'inspiring'],
    'Cozy': ['warm', 'sweet', 'home', 'family', 'gentle', 'peaceful', 'comfort', 'bakery'],
    'Intellectual': ['philosophy', 'science', 'complex', 'theory', 'history', 'psychology', 'mind'],
    'Adventurous': ['journey', 'quest', 'exploration', 'action', 'mystery', 'wild', 'ship']
}

def get_mood_ids(text, mood_objs):
    text = text.lower()
    ids = []
    for mood_name, keywords in MOOD_MAP.items():
        if any(word in text for word in keywords):
            ids.append(mood_objs[mood_name].id)
    return ids

@transaction.atomic
def import_all_books(file_path):
    print("🚀 Начинаем массовый импорт 10,000 книг...")
    
    # Предзагрузка настроений для скорости
    mood_objs = {m.name: m for m in Mood.objects.all()}
    
    books_to_create = []
    book_mood_relations = [] # Для M2M связей

    with open(file_path, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            data = json.loads(line)
            
            title = data.get('title', 'Unknown')[:255]
            summary = data.get('description', '')
            
            if not summary or len(summary) < 50: # Пропускаем пустые или слишком короткие
                continue

            book = Book(
                title=title,
                author=data.get('authors', [{'name': 'Unknown'}])[0].get('name', 'Unknown')[:255],
                summary=summary,
                publication_year=int(data.get('publication_year')) if data.get('publication_year') else None
            )
            books_to_create.append(book)

            # Каждые 1000 книг сбрасываем в базу для экономии памяти
            if len(books_to_create) >= 1000:
                created_books = Book.objects.bulk_create(books_to_create)
                
                # Добавляем настроения для созданных книг
                for b in created_books:
                    m_ids = get_mood_ids(b.summary, mood_objs)
                    for m_id in m_ids:
                        book_mood_relations.append(Book.moods.through(book_id=b.id, mood_id=m_id))
                
                books_to_create = []
                print(f"✅ Обработано {i+1} строк...")

        # Дозаписываем остатки
        if books_to_create:
            created_books = Book.objects.bulk_create(books_to_create)
            for b in created_books:
                m_ids = get_mood_ids(b.summary, mood_objs)
                for m_id in m_ids:
                    book_mood_relations.append(Book.moods.through(book_id=b.id, mood_id=m_id))

        # Массово создаем связи ManyToMany
        print("🔗 Привязываем настроения к книгам...")
        Book.moods.through.objects.bulk_create(book_mood_relations, ignore_conflicts=True)

    print(f"🏁 Готово! База данных заполнена.")

if __name__ == '__main__':
    import_all_books('data/goodreads_books.json')