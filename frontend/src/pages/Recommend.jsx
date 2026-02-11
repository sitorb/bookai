import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoodRecommendations } from '../services/api';
import toast from 'react-hot-toast';

const Recommend = () => {
    // Hooks must be at the very top of the function
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mood, setMood] = useState('');
    const [savedBookIds, setSavedBookIds] = useState(new Set());
    const navigate = useNavigate();

    // Protection logic inside the hook
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
            setResults(data.recommendations || []);
            setMood(data.detected_mood || '');
            toast.success("Recommendations found!");
        } catch (err) {
            toast.error("Failed to get recommendations.");
            console.error(err);
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
                if (isAdded) {
                    newSaved.delete(bookId);
                    toast("Removed from library", { icon: '🗑️' });
                } else {
                    newSaved.add(bookId);
                    toast.success("Saved to library!");
                }
                setSavedBookIds(newSaved);
            }
        } catch (err) {
            toast.error("Error updating favorites.");
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif text-center mb-10">AI Librarian</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-12">
                    <textarea 
                        className="p-4 rounded-xl border-2 border-stone-200 focus:border-stone-800 outline-none shadow-sm"
                        placeholder="Describe your mood..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" disabled={loading} className="bg-stone-800 text-white py-3 px-8 rounded-full font-bold self-center">
                        {loading ? "Searching..." : "Recommend Books"}
                    </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.map((book) => (
                        <div key={book.id} className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-2">{book.title}</h2>
                                <p className="text-stone-500 mb-4 italic">by {book.author}</p>
                                <p className="text-stone-600 mb-6 line-clamp-3">{book.summary}</p>
                            </div>
                            <button 
                                onClick={() => handleToggleFavorite(book.id)}
                                className={`w-full py-2 rounded-lg font-bold border-2 transition-all ${
                                    savedBookIds.has(book.id) ? "bg-stone-800 text-white border-stone-800" : "border-stone-800 text-stone-800"
                                }`}
                            >
                                {savedBookIds.has(book.id) ? "In Collection" : "Save to Library"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommend;