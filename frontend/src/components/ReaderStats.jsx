import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReaderStats = () => {
    const [stats, setStats] = useState({
        total_books: 0,
        average_rating: 0,
        top_moods: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/users/analytics/', {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Analytics fetch failed");
                // We don't toast here to avoid annoying the user if they're just browsing
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStats();
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-stone-100 rounded-[2rem]"></div>
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Stat 1: Total Collection */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">Collection</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-serif text-stone-900">{stats.total_books}</span>
                    <span className="text-stone-400 font-serif italic text-lg">volumes</span>
                </div>
            </div>

            {/* Stat 2: Average Taste */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">Taste Score</span>
                <div className="flex items-center gap-2">
                    <span className="text-5xl font-serif text-stone-900">{stats.average_rating}</span>
                    <span className="text-2xl text-yellow-400">★</span>
                </div>
            </div>

            {/* Stat 3: Top Moods */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Reader DNA</span>
                <div className="flex flex-wrap justify-center gap-2">
                    {stats.top_moods.length > 0 ? (
                        stats.top_moods.map((m, i) => (
                            <span 
                                key={i} 
                                className="px-3 py-1 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-tighter"
                            >
                                {m.detected_mood}
                            </span>
                        ))
                    ) : (
                        <span className="text-stone-300 italic text-sm font-serif">Awaiting data...</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReaderStats;