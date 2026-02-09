import React, { useState } from 'react';
import { getMoodRecommendations } from '../services/api';

const Recommend = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mood, setMood] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await getMoodRecommendations(query);
            setResults(data.recommendations);
            setMood(data.detected_mood);
        } catch (err) {
            console.error("Recommendation failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = async (bookId) => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            alert("Please login to save books!");
            return;
        }

        try {
            // Updated URL to match your library/views.py setup
            const response = await fetch(`http://127.0.0.1:8000/api/library/add/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: bookId })
            });

            if (response.ok) {
                alert("Book saved to your library! ❤️");
            }
        } catch (err) {
            console.error("Error favoriting book", err);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 p-6 sm:p-12 text-stone-900">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-serif mb-4">AI Librarian</h1>
                    <p className="text-stone-600 italic text-xl">"Tell me how you feel, and I will find your next world."</p>
                </header>

                <form onSubmit={handleSubmit} className="mb-16">
                    <div className="flex flex-col gap-4">
                        <textarea
                            className="w-full p-6 rounded-2xl border-2 border-stone-300 focus:border-stone-500 bg-white outline-none transition-all text-lg shadow-md"
                            rows="3"
                            placeholder="e.g., I'm feeling a bit lonely and want a story that feels cozy..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="self-center bg-stone-800 text-white px-12 py-3 rounded-full hover:bg-stone-700 disabled:bg-stone-400 transition-all shadow-lg font-bold"
                        >
                            {loading ? "Searching Shelves..." : "Get Recommendations"}
                        </button>
                    </div>
                </form>

                {mood && (
                    <div className="mb-8 text-center">
                        <span className="px-4 py-2 bg-stone-200 text-stone-700 rounded-full text-sm uppercase tracking-widest font-bold">
                            Detected Mood: {mood}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {results.map((book) => (
                        <div key={book.id} className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-transform">
                            <div>
                                <h2 className="text-3xl font-serif mb-2">{book.title}</h2>
                                <p className="text-stone-500 font-medium text-lg mb-4">by {book.author}</p>
                                <p className="text-stone-600 leading-relaxed mb-6">{book.summary}</p>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {book.moods.map((m, i) => (
                                        <span key={i} className="px-3 py-1 bg-stone-100 text-stone-500 text-xs rounded-md border border-stone-200 uppercase font-semibold">
                                            {m.name}
                                        </span>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => handleFavorite(book.id)}
                                    className="w-full py-3 border-2 border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors font-bold flex items-center justify-center gap-2"
                                >
                                    <span>♥</span> Save to Library
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommend;