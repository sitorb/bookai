import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReaderStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://127.0.0.1:8000/api/users/analytics/', {
            headers: { 'Authorization': `Token ${token}` }
        }).then(res => setStats(res.data));
    }, []);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
                <p className="text-stone-400 text-xs uppercase font-bold tracking-widest mb-2">Library Size</p>
                <p className="text-4xl font-serif text-stone-800">{stats.total_books}</p>
                <p className="text-stone-500 text-sm italic">Books Saved</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
                <p className="text-stone-400 text-xs uppercase font-bold tracking-widest mb-2">Avg. Rating</p>
                <p className="text-4xl font-serif text-stone-800">{stats.average_rating} <span className="text-xl text-yellow-400">★</span></p>
                <p className="text-stone-500 text-sm italic">Taste Score</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <p className="text-stone-400 text-xs uppercase font-bold tracking-widest mb-2 text-center">Top Moods</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {stats.top_moods.map((m, i) => (
                        <span key={i} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold capitalize">
                            {m.detected_mood}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReaderStats;