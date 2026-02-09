// frontend/src/pages/Library.jsx
import React, { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../services/api';

const Library = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavs = async () => {
            try {
                const data = await getFavorites();
                setFavorites(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavs();
    }, []);

    const handleRemove = async (bookId) => {
        try {
            await removeFavorite(bookId);
            // Optimistic UI update: filter out the deleted book from state
            setFavorites(favorites.filter(book => book.id !== bookId));
        } catch (err) {
            alert("Could not remove the book. Try again.");
        }
    };

    if (loading) return <div className="p-10 text-center font-serif">Opening your library...</div>;

    return (
        <div className="min-h-screen bg-stone-50 p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-serif text-stone-900 mb-8 border-b border-stone-200 pb-4">
                    My Collection
                </h1>

                {favorites.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-stone-500 italic mb-4">Your shelves are empty.</p>
                        <a href="/recommend" className="text-stone-800 font-bold underline hover:text-stone-600">
                            Go discover some books
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((book) => (
                            <div key={book.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-serif text-stone-800">{book.title}</h3>
                                    <p className="text-stone-500 mb-4">by {book.author}</p>
                                </div>
                                <button 
                                    onClick={() => handleRemove(book.id)}
                                    className="text-sm text-red-500 hover:text-red-700 font-medium self-start transition-colors"
                                >
                                    Remove from Library
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