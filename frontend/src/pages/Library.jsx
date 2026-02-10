import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/api';

const Library = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Protection: If no token, kick user back to Login
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchFavs = async () => {
            try {
                const data = await getFavorites();
                setFavorites(data);
            } catch (err) {
                console.error("Failed to load library", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavs();
    }, [navigate]);

    const handleRemove = async (bookId) => {
        try {
            await removeFavorite(bookId);
            // Optimistic Update: remove from screen instantly
            setFavorites(favorites.filter(book => book.id !== bookId));
        } catch (err) {
            alert("Could not remove the book. Try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 font-serif italic text-stone-400">
            Opening your personal collection...
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 p-8 sm:p-12 text-stone-900">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-serif mb-4">My Library</h1>
                <p className="text-stone-500 italic mb-12 border-b border-stone-200 pb-6">Your curated selection of literary worlds.</p>

                {favorites.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                        <p className="text-stone-400 text-xl italic mb-6">Your shelves are currently empty.</p>
                        <button 
                            onClick={() => navigate('/recommend')}
                            className="bg-stone-800 text-white px-8 py-3 rounded-full font-bold hover:bg-stone-700 transition-all"
                        >
                            Go Discover Books
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((book) => (
                            <div key={book.id} className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                                <div>
                                    <h3 className="text-2xl font-serif mb-2 text-stone-800">{book.title}</h3>
                                    <p className="text-stone-500 font-medium mb-4 italic">by {book.author}</p>
                                    <div className="h-1 w-12 bg-stone-200 mb-6"></div>
                                </div>
                                <button 
                                    onClick={() => handleRemove(book.id)}
                                    className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
                                >
                                    <span>✕</span> Remove from Collection
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