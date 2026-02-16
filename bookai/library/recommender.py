import os
import pickle
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from books.models import Book

def clean_text(text):
    """ Strips HTML, special characters, and forces lowercase for better matching. """
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub(r'[^a-z\s]', '', text) # Remove punctuation/numbers
    return text

def generate_embeddings():
    books = Book.objects.all()
    if not books.exists():
        return "The archives are empty."

    # Pre-process the summaries to remove noise
    texts = [clean_text(f"{b.title} {b.summary}") for b in books]
    ids = [b.id for b in books]

    # UPGRADE: Added ngram_range=(1, 2) 
    # This helps the AI understand "dark fantasy" as one concept rather than just "dark" and "fantasy"
    vectorizer = TfidfVectorizer(
        stop_words='english', 
        max_features=10000, 
        ngram_range=(1, 2) 
    )
    tfidf_matrix = vectorizer.fit_transform(texts)

    # UPGRADE: Increased n_components for 5,000 records
    n_components = min(200, tfidf_matrix.shape[1] - 1)
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    concept_matrix = svd.fit_transform(tfidf_matrix)

    data = {'vectorizer': vectorizer, 'svd': svd, 'matrix': concept_matrix, 'ids': ids}

    with open('book_embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    return "The AI brain has been successfully rebuilt."