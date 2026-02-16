import os
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from books.models import Book

def generate_embeddings():
    """
    Processes all books in the database to build the AI recommendation matrix.
    Saves the result to book_embeddings.pkl.
    """
    books = Book.objects.all()
    if not books.exists():
        print("The archives are empty. Please import books before building the AI.")
        return

    print(f"Cataloging {books.count()} volumes...")

    # Combine title, author, and summary for a rich search context
    texts = [f"{b.title} {b.author} {b.summary}" for b in books]
    ids = [b.id for b in books]

    # Vectorize the text data
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(texts)

    # Dimensionality reduction for smoother conceptual matching
    # min(100, features) ensures it doesn't crash if you have very few books/words
    n_components = min(100, tfidf_matrix.shape[1] - 1) if tfidf_matrix.shape[1] > 1 else 1
    svd = TruncatedSVD(n_components=n_components)
    concept_matrix = svd.fit_transform(tfidf_matrix)

    # Bundle the brain together
    data = {
        'vectorizer': vectorizer,
        'svd': svd,
        'matrix': concept_matrix,
        'ids': ids
    }

    # Save to disk
    with open('book_embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    print("The AI brain has been successfully built and stored in book_embeddings.pkl")

def get_recommendations(user_query, top_k=6):
    """
    Takes a user's mood or query and returns the most conceptually similar books.
    """
    pkl_path = 'book_embeddings.pkl'
    
    # Check if the AI brain exists; if not, return the newest books as a fallback
    if not os.path.exists(pkl_path):
        print("AI brain not found. Returning latest arrivals.")
        return Book.objects.all().order_by('-id')[:top_k]

    try:
        with open(pkl_path, 'rb') as f:
            data = pickle.load(f)

        # Convert user query into the same conceptual space
        query_tfidf = data['vectorizer'].transform([user_query])
        query_concept = data['svd'].transform(query_tfidf)
        
        # Calculate similarity against the entire library
        scores = cosine_similarity(query_concept, data['matrix']).flatten()
        
        # Get the top K matches
        indices = scores.argsort()[-top_k:][::-1]
        
        # Retrieve the actual Book objects from the database
        recommended_books = [Book.objects.get(id=data['ids'][i]) for i in indices]
        return recommended_books

    except Exception as e:
        print(f"Error reading the archives: {e}")
        return Book.objects.all()[:top_k]