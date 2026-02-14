import React, { useState } from 'react';
import axios from 'axios';

const Recommend = () => {
  const [mood, setMood] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecommend = async () => {
    if (!mood.trim()) return;

    setLoading(true);
    setError(null);
    setBooks([]);

    try {
      // NOTE: Ensure this matches your Django URL (e.g., http://127.0.0.1:8000/api/recommend/)
      const response = await axios.post('http://127.0.0.1:8000/api/recommend/', {
        mood: mood
      });

      setBooks(response.data);
    } catch (err) {
      console.error("Full Error Object:", err);
      setError(err.response?.data?.error || "Failed to reach the AI Librarian. Check if Django is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>AI Librarian</h1>
      <p>Tell me how you feel, and I'll find a book from our library of 766 titles.</p>
      
      <textarea
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="e.g., I feel lonely and want a story about a long journey..."
        style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
      />
      
      <br />
      
      <button 
        onClick={handleRecommend}
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '10px 30px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Consulting the Archives...' : 'Recommend Books'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>⚠️ {error}</p>}

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', textAlign: 'left' }}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>
              {book.summary.substring(0, 150)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommend;