import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/api';
import toast from 'react-hot-toast';

const Library = () => {
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        let url = `http://127.0.0.1:8000/api/library/?search=${searchTerm}`;
        if (filterRating > 0) url += `&rating=${filterRating}`;

        fetch(url, { headers: { 'Authorization': `Token ${token}` } })
            .then(res => res.json())
            .then(data => setFavorites(data));
    }, [searchTerm, filterRating, navigate]);

    return (
        <div className="min-h-screen bg-[#fcfaf8] pb-20">
            {/* Elegant Header */}
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
                <h1 className="text-5xl font-serif text-stone-900 mb-4">My Archive</h1>
                <p className="text-stone-500 italic mb-8">A curated collection of your literary journey.</p>

                {/* Professional Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-2 rounded-2xl shadow-sm border border-stone-100">
                    <div className="relative flex-grow w-full">
                        <span className="absolute left-4 top-3 text-stone-400">🔍</span>
                        <input 
                            type="text"
                            placeholder="Search by title or author..."
                            className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-stone-800"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="bg-stone-50 px-4 py-2 rounded-xl text-stone-600 font-medium outline-none border-none cursor-pointer"
                        onChange={(e) => setFilterRating(Number(e.target.value))}
                    >
                        <option value="0">All Ratings</option>
                        <option value="5">⭐⭐⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐ & Up</option>
                    </select>
                </div>
            </div>

            {/* Book Grid */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {favorites.map((book) => (
                    <div key={book.id} className="group bg-white rounded-3xl p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-1 bg-stone-200 mb-6 group-hover:w-20 transition-all duration-500"></div>
                            <h3 className="text-2xl font-serif text-stone-900 mb-1 leading-tight">{book.title}</h3>
                            <p className="text-stone-400 uppercase tracking-widest text-[10px] font-bold mb-6">by {book.author}</p>
                            
                            <div className="flex gap-1 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={`text-lg ${star <= book.rating ? 'text-yellow-400' : 'text-stone-100'}`}>★</span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-6 border-t border-stone-50">
                            <button className="text-stone-400 hover:text-stone-900 text-xs font-bold uppercase tracking-tighter transition-colors">Details</button>
                            <button 
                                onClick={() => removeFavorite(book.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-50 text-stone-300 hover:bg-red-50 hover:text-red-400 transition-all"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;