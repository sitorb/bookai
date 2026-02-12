import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoodRecommendations } from '../services/api';
import toast from 'react-hot-toast';

const Recommend = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savedBookIds, setSavedBookIds] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const data = await getMoodRecommendations(query);
            setResults(data.recommendations || []);
            toast.success(`Mood: ${data.detected_mood}`, { icon: '✨' });
        } catch (err) {
            toast.error("The librarian is busy. Try again?");
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
                toast.success(isAdded ? "Removed" : "Saved to Archive");
            }
        } catch (err) {
            toast.error("Connection error.");
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfaf8] pb-20">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
                <h1 className="text-6xl font-serif text-stone-900 mb-6 leading-tight">
                    What should you <br /> read <span className="italic text-stone-400">tonight?</span>
                </h1>
                
                <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
                    <textarea
                        className="w-full p-8 rounded-3xl bg-white border border-stone-100 shadow-xl outline-none focus:ring-2 ring-stone-200 transition-all text-lg font-serif italic"
                        rows="3"
                        placeholder="I'm feeling adventurous but a bit lonely..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="absolute bottom-4 right-4 bg-stone-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-stone-700 transition-all shadow-lg disabled:bg-stone-300"
                    >
                        {loading ? "Thinking..." : "Consult AI"}
                    </button>
                </form>
            </div>

            {/* Results Grid */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                {results.map((book) => (
                    <div key={book.id} className="bg-white rounded-[2rem] p-10 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <h2 className="text-3xl font-serif text-stone-900 mb-2">{book.title}</h2>
                                <p className="text-stone-400 uppercase tracking-[0.2em] text-[10px] font-black">
                                    {book.author}
                                </p>
                            </div>
                            <button 
                                onClick={() => handleToggleFavorite(book.id)}
                                className={`p-4 rounded-2xl transition-all ${
                                    savedBookIds.has(book.id) ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                                }`}
                            >
                                {savedBookIds.has(book.id) ? '✓' : '♥'}
                            </button>
                        </div>
                        <p className="text-stone-600 leading-relaxed mb-8 italic">"{book.summary}"</p>
                        <div className="h-[1px] w-full bg-stone-50"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommend;