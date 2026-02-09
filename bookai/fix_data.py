import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book
from moods.models import Mood

def clean_and_seed():
    print("🧹 Cleaning old Russian data...")
    Book.objects.all().delete()
    Mood.objects.all().delete()

    print("🌱 Injecting English Moods...")
    moods = {
        "Melancholic": "Thoughtful, quiet, and slightly sad vibes.",
        "Inspiring": "Books that make you want to change the world.",
        "Cozy": "Warm, safe, and comforting stories.",
        "Dystopian": "Dark futures and societal reflections.",
        "Philosophical": "Deep questions about existence."
    }
    
    mood_objs = {}
    for name, desc in moods.items():
        mood_objs[name] = Mood.objects.create(name=name, description=desc)

    print("📚 Injecting English Books...")
    books_data = [
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "summary": "A tragic story of obsession and the American Dream.",
            "moods": ["Melancholic", "Philosophical"]
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "summary": "A terrifying look at a totalitarian future where thought is a crime.",
            "moods": ["Dystopian", "Philosophical"]
        },
        {
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "summary": "A cozy but grand adventure through Middle-earth.",
            "moods": ["Cozy", "Inspiring"]
        },
        {
            "title": "Notes from Underground",
            "author": "Fyodor Dostoevsky",
            "summary": "The first existentialist novel about a bitter man in St. Petersburg.",
            "moods": ["Philosophical", "Melancholic"]
        }
    ]

    for b in books_data:
        book = Book.objects.create(
            title=b["title"], 
            author=b["author"], 
            summary=b["summary"]
        )
        for m_name in b["moods"]:
            book.moods.add(mood_objs[m_name])

    print("✅ Success! Your database is now strictly English.")

if __name__ == "__main__":
    clean_and_seed()