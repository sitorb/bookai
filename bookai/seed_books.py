import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book
from moods.models import Mood

def seed_data():
    print("🌱 Seeding moods and books...")

    # 1. Create Moods
    mood_data = [
        {"name": "Melancholic", "desc": "Feeling thoughtful and slightly sad."},
        {"name": "Inspiring", "desc": "Looking for motivation and hope."},
        {"name": "Cozy", "desc": "Safe, warm, and comforting vibes."},
        {"name": "Intellectual", "desc": "Deep thoughts and complex ideas."},
        {"name": "Adventurous", "desc": "Excitement and new horizons."}
    ]

    mood_objs = {}
    for m in mood_data:
        obj, _ = Mood.objects.get_or_create(name=m['name'], description=m['desc'])
        mood_objs[m['name']] = obj

    # 2. Create Books
    books_data = [
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "summary": "A story of wealth, love, and the tragic pursuit of the American Dream in the 1920s.",
            "year": 1925,
            "moods": ["Melancholic", "Intellectual"]
        },
        {
            "title": "The Alchemist",
            "author": "Paulo Coelho",
            "summary": "A journey of a young shepherd seeking his destiny and learning to listen to his heart.",
            "year": 1988,
            "moods": ["Inspiring", "Adventurous"]
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "summary": "A chilling dystopian tale of surveillance, control, and the loss of individual freedom.",
            "year": 1949,
            "moods": ["Intellectual", "Melancholic"]
        },
        {
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "summary": "An epic adventure of a quiet hobbit who goes on a journey to reclaim a stolen treasure.",
            "year": 1937,
            "moods": ["Adventurous", "Cozy"]
        }
    ]

    for b in books_data:
        book, created = Book.objects.get_or_create(
            title=b['title'],
            author=b['author'],
            summary=b['summary'],
            publication_year=b['year']
        )
        # Add relationships
        for m_name in b['moods']:
            book.moods.add(mood_objs[m_name])

    print("✅ Done! Database is now populated.")

if __name__ == '__main__':
    seed_data()