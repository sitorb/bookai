import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoodRecommendations } from '../services/api';

const Recommend = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mood, setMood] = useState('');
    const [savedBookIds, setSavedBookIds] = useState(new Set());
    const navigate = useNavigate();

    // The Hook MUST stay inside the component function
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const data = await getMoodRecommendations(query);
            setResults(data.recommendations);
            setMood(data.detected_mood);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (bookId) => {
        const token = localStorage.getItem('token');
        const isAdded = savedBookIds.has(bookId);
        const endpoint = isAdded ? 'remove/' : 'add/';
        
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/library/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: bookId })
            });

            if (response.ok) {
                const newSaved = new Set(savedBookIds);
                isAdded ? newSaved.delete(bookId) : newSaved.add(bookId);
                setSavedBookIds(newSaved);
            }
        } catch (err) {
            console.error("Toggle failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 p-8 text-stone-900">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-serif mb-4">AI Librarian</h1>
                    <p className="text-stone-600 italic text-xl">"Find your next world."</p>
                </header>

                <form onSubmit={handleSubmit} className="mb-16 flex flex-col gap-4">
                    <textarea
                        className="w-full p-6 rounded-2xl border-2 border-stone-300 bg-white outline-none focus:border-stone-500 shadow-md"
                        rows="3"
                        placeholder="How are you feeling?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" disabled={loading} className="bg-stone-800 text-white px-8 py-3 rounded-full hover:bg-stone-700 font-bold self-center">
                        {loading ? "Searching..." : "Recommend"}
                    </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {results.map((book) => (
                        <div key={book.id} className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl flex flex-col justify-between">
                            <div>
                                <h2 className="text-3xl font-serif mb-2">{book.title}</h2>
                                <p className="text-stone-500 mb-4">by {book.author}</p>
                                <p className="text-stone-600 mb-6">{book.summary}</p>
                            </div>
                            <button 
                                onClick={() => handleToggleFavorite(book.id)}
                                className={`w-full py-3 border-2 rounded-xl font-bold ${
                                    savedBookIds.has(book.id) ? "bg-stone-800 text-white" : "text-red-500 border-red-100 hover:bg-red-50"
                                }`}
                            >
                                {savedBookIds.has(book.id) ? "✓ Saved" : "♥ Save"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommend;