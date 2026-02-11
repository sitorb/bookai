import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/api';
import toast from 'react-hot-toast';

const Library = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        getFavorites()
            .then(data => setFavorites(data))
            .catch(() => toast.error("Could not fetch library items."))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleRemove = async (bookId) => {
        try {
            await removeFavorite(bookId);
            setFavorites(favorites.filter(book => book.id !== bookId));
            toast.success("Book removed from shelves.");
        } catch (err) {
            toast.error("Failed to remove book.");
        }
    };

    if (loading) return <div className="p-20 text-center font-serif italic text-stone-400">Consulting the archives...</div>;

    return (
        <div className="min-h-screen bg-stone-50 p-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-serif mb-12">Personal Collection</h1>
                {favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                        <p className="text-stone-400 mb-6">Your collection is empty.</p>
                        <button onClick={() => navigate('/recommend')} className="bg-stone-800 text-white px-8 py-3 rounded-full font-bold shadow-lg">Find a Book</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {favorites.map((book) => (
                            <div key={book.id} className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 flex flex-col justify-between hover:shadow-xl transition-all">
                                <div>
                                    <h3 className="text-xl font-serif mb-2">{book.title}</h3>
                                    <p className="text-stone-500 text-sm mb-4">by {book.author}</p>
                                </div>
                                <button onClick={() => handleRemove(book.id)} className="text-red-400 text-sm font-bold hover:text-red-600 text-left mt-4 border-t border-stone-50 pt-2">
                                    ✕ Remove
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