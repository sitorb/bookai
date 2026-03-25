import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from books.models import Book

# Adding categories so your frontend filters actually work!
books = [
    {
        "title": "The Great Gatsby", 
        "author": "F. Scott Fitzgerald", 
        "category": "Classic",
        "summary": "A tale of wealth, love, and the elusive American Dream in the 1920s."
    },
    {
        "title": "Dracula", 
        "author": "Bram Stoker", 
        "category": "Gothic",
        "summary": "An ancient vampire travels to London to spread the undead curse."
    },
    {
        "title": "The Picture of Dorian Gray", 
        "author": "Oscar Wilde", 
        "category": "Philosophical",
        "summary": "A young man stays eternally young while his portrait ages with his sins."
    },
    {
        "title": "Frankenstein", 
        "author": "Mary Shelley", 
        "category": "Science Fiction",
        "summary": "A scientist brings a creature to life, only to be haunted by his creation."
    },
    {
        "title": "The Raven", 
        "author": "Edgar Allan Poe", 
        "category": "Poetry",
        "summary": "A macabre poem about a grieving lover visited by a talking raven."
    }
]

for b in books:
    # This will find the book by title and update it with the new category
    obj, created = Book.objects.update_or_create(
        title=b['title'], 
        defaults=b
    )
    if created:
        print(f"Added: {b['title']}")
    else:
        print(f"Updated: {b['title']}")

print("\nSuccess! The Library is now fully categorized.")