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

    return (
        <div className="min-h-screen bg-stone-50 p-6 sm:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-serif text-stone-900 mb-4">AI Librarian</h1>
                    <p className="text-stone-600 italic">"Tell me how you feel, and I will find your next world."</p>
                </header>

                <form onSubmit={handleSubmit} className="mb-12">
                    <div className="relative">
                        <textarea
                            className="w-full p-6 rounded-2xl border-2 border-stone-200 focus:border-stone-400 outline-none transition-all text-lg shadow-sm"
                            rows="4"
                            placeholder="e.g., I'm feeling a bit lonely and want a story that feels cozy and warm..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="absolute bottom-4 right-4 bg-stone-800 text-white px-8 py-2 rounded-xl hover:bg-stone-700 disabled:bg-stone-400 transition-colors"
                        >
                            {loading ? "Searching..." : "Recommend"}
                        </button>
                    </div>
                </form>

                {mood && (
                    <div className="mb-6 text-center">
                        <span className="text-sm uppercase tracking-widest text-stone-400 font-semibold">
                            Detected Mood: {mood}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {results.map((book) => (
                        <div key={book.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-md hover:shadow-xl transition-shadow">
                            <h2 className="text-2xl font-serif text-stone-800 mb-1">{book.title}</h2>
                            <p className="text-stone-500 font-medium mb-4">by {book.author}</p>
                            <p className="text-stone-600 line-clamp-3 mb-4">{book.summary}</p>
                            <div className="flex flex-wrap gap-2">
                                {book.moods.map((m, i) => (
                                    <span key={i} className="px-3 py-1 bg-stone-100 text-stone-500 text-xs rounded-full uppercase">
                                        {m.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recommend;