import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookai.settings')
django.setup()
from library.recommender import generate_embeddings
print(generate_embeddings())