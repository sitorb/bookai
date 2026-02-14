import os
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from books.models import Book

def generate_embeddings():
    """Builds a semantic map using TF-IDF (No Torch/DLL issues)"""
    books = Book.objects.all()
    if not books.exists():
        return "No books found in database."

    # Combine title and summary for better context
    texts = [f"{b.title} {b.summary}" for b in books]
    
    # TF-IDF converts text into math based on word importance
    vectorizer = TfidfVectorizer(stop_words='english')
    matrix = vectorizer.fit_transform(texts)
    
    data = {
        'ids': [b.id for b in books],
        'vectorizer': vectorizer,
        'matrix': matrix
    }
    
    # Save the 'brain' to a file
    with open('book_embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
    
    return f"Successfully mapped {len(texts)} books using Lite-AI!"

def get_recommendations(user_query, top_k=5):
    """Finds books similar to the user's mood query"""
    if not os.path.exists('book_embeddings.pkl'):
        return []

    with open('book_embeddings.pkl', 'rb') as f:
        data = pickle.load(f)

    # Convert the user's mood into the same math format
    query_vec = data['vectorizer'].transform([user_query])
    
    # Compare query math to all books
    scores = cosine_similarity(query_vec, data['matrix']).flatten()
    
    # Get the indices of the best matches
    indices = scores.argsort()[-top_k:][::-1]
    
    recommended_books = []
    for i in indices:
        book_id = data['ids'][i]
        recommended_books.append(Book.objects.get(id=book_id))
        
    return recommended_books