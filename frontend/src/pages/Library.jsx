import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/api';
import toast from 'react-hot-toast';

const Library = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Protection & Initial Fetch
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchLibrary = async () => {
            try {
                const data = await getFavorites();
                setFavorites(data);
            } catch (err) {
                toast.error("Failed to load your library.");
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [navigate]);

    // 2. Handle Book Rating (1-5 Stars)
    const handleRate = async (bookId, ratingValue) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/library/rate/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: bookId, rating: ratingValue })
            });

            if (response.ok) {
                // Update the local state instantly so stars change color
                setFavorites(prev => prev.map(fav => 
                    fav.id === bookId ? { ...fav, rating: ratingValue } : fav
                ));
                toast.success("Rating saved!", { icon: '⭐' });
            }
        } catch (err) {
            toast.error("Could not save rating.");
        }
    };

    // 3. Handle Removing a Book
    const handleRemove = async (bookId) => {
        try {
            await removeFavorite(bookId);
            setFavorites(favorites.filter(book => book.id !== bookId));
            toast.success("Removed from collection");
        } catch (err) {
            toast.error("Delete failed.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 font-serif italic text-stone-400">
            Organizing your shelves...
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 p-8 sm:p-12 text-stone-900">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-stone-200 pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-serif mb-2">My Library</h1>
                        <p className="text-stone-500 italic">Your personal literary sanctuary.</p>
                    </div>
                    <span className="text-sm font-bold bg-stone-200 px-4 py-1 rounded-full text-stone-600">
                        {favorites.length} Books
                    </span>
                </header>

                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200 shadow-inner text-center">
                        <div className="text-6xl mb-4">📖</div>
                        <h2 className="text-2xl font-serif text-stone-800 mb-2">The shelves are quiet...</h2>
                        <p className="text-stone-500 mb-8 max-w-sm">Save recommendations to see them here.</p>
                        <button 
                            onClick={() => navigate('/recommend')}
                            className="bg-stone-800 text-white px-10 py-3 rounded-full hover:bg-stone-700 transition-all font-bold shadow-lg"
                        >
                            Find New Books
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((book) => (
                            <div key={book.id} className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                                <div>
                                    <h3 className="text-2xl font-serif mb-1 text-stone-800">{book.title}</h3>
                                    <p className="text-stone-500 font-medium mb-4 italic text-sm">by {book.author}</p>
                                    
                                    {/* --- Rating Stars Section --- */}
                                    <div className="flex gap-1 mb-6">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => handleRate(book.id, star)}
                                                className={`text-2xl transition-colors ${
                                                    star <= (book.rating || 0) ? 'text-yellow-400' : 'text-stone-200 hover:text-yellow-200'
                                                }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    {/* ---------------------------- */}

                                    <div className="h-1 w-12 bg-stone-800 mb-6"></div>
                                </div>
                                <button 
                                    onClick={() => handleRemove(book.id)}
                                    className="text-xs font-bold text-red-300 hover:text-red-500 transition-colors uppercase tracking-widest"
                                >
                                    ✕ Remove Book
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;