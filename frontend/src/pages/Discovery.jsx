import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Discovery = () => {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/library/community/')
            .then(res => setFeed(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-stone-50 p-8 sm:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif text-stone-800">Community Discovery</h1>
                    <p className="text-stone-500 italic">See what fellow readers are adding to their shelves.</p>
                </header>

                <div className="space-y-6">
                    {feed.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-2xl">
                                    📖
                                </div>
                                <div>
                                    <h3 className="font-bold text-stone-800">{item.book_title}</h3>
                                    <p className="text-sm text-stone-500">by {item.author}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-stone-300 uppercase tracking-widest">
                                Saved {item.time_ago}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Discovery;