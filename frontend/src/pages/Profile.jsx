import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReaderStats from '../components/ReaderStats'; // Ensure this component exists

const Profile = () => {
    // 1. All Hooks must be at the very top
    const [userData, setUserData] = useState({ username: '', email: '', bio: '' });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        const fetchProfileData = async () => {
            try {
                const [profileRes, historyRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/users/profile/', {
                        headers: { 'Authorization': `Token ${token}` }
                    }),
                    axios.get('http://127.0.0.1:8000/api/users/history/', {
                        headers: { 'Authorization': `Token ${token}` }
                    })
                ]);
                setUserData(profileRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                toast.error("Session expired or server error");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfileData();
        } else {
            setLoading(false);
        }
    }, []);

    const handleClearHistory = async () => {
        const token = localStorage.getItem('token');
        if (!window.confirm("Permanent delete your mood history?")) return;

        try {
            await axios.delete('http://127.0.0.1:8000/api/users/history/clear/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            setHistory([]);
            toast.success("History cleared");
        } catch (err) {
            toast.error("Failed to clear history");
        }
    };

    // 2. Conditional rendering happens AFTER all hooks are declared
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] font-serif italic text-stone-400">
            Fetching your literary profile...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfaf8] pb-20">
            <div className="max-w-5xl mx-auto px-6 pt-16">
                
                {/* Profile Header Card */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100 mb-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center text-white text-4xl font-serif">
                        {userData.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-serif text-stone-900 mb-1">{userData.username}</h1>
                        <p className="text-stone-400 mb-4">{userData.email}</p>
                        <p className="text-stone-600 italic max-w-md">
                            {userData.bio || "No bio set yet. Tell us about your reading style."}
                        </p>
                    </div>
                </div>

                {/* Statistics Component */}
                <ReaderStats />

                {/* Mood History Section */}
                <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-serif text-stone-800">Recent Moods</h2>
                        <p className="text-stone-400 text-sm italic">What you've been looking for lately.</p>
                    </div>
                    {history.length > 0 && (
                        <button 
                            onClick={handleClearHistory}
                            className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors"
                        >
                            Clear Archive
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {history.length === 0 ? (
                        <p className="text-stone-400 italic text-center py-10">No history found yet.</p>
                    ) : (
                        history.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-stone-100 flex justify-between items-center group hover:border-stone-300 transition-all">
                                <span className="text-stone-700 font-serif">"{item.query}"</span>
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-stone-50 text-stone-400 text-[10px] font-bold uppercase tracking-tighter rounded-full group-hover:bg-stone-900 group-hover:text-white transition-colors">
                                        {item.detected_mood || item.mood}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;