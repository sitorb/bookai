import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()

from library.recommender import get_recommendations

print("🧪 Тестирую AI...")
results = get_recommendations("A detective story in London")
print(f"Найдено книг: {len(results)}")
for book in results:
    print(f"- {book.title} (ID: {book.id})")