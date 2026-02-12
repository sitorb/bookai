import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReaderStats from '../components/ReaderStats';


const Profile = () => {
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
                toast.error("Error loading profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) return <div className="p-20 text-center italic">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg mb-8">
                <h1 className="text-3xl font-serif mb-2">{userData.username}</h1>
                <p className="text-stone-500 mb-4">{userData.email}</p>
                <p className="text-stone-700">{userData.bio || "No bio added yet."}</p>
            </div>

            <h2 className="text-xl font-serif mb-4 text-stone-800 uppercase tracking-widest">Mood History</h2>
            <div className="space-y-4">
                {history.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-stone-200 flex justify-between shadow-sm">
                        <span className="italic">"{item.query}"</span>
                        <span className="font-bold text-stone-400 uppercase text-xs">{item.mood}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Inside src/pages/Profile.jsx

const handleClearHistory = async () => {
    const token = localStorage.getItem('token');
    if (!window.confirm("Are you sure you want to delete your entire search history?")) return;

    try {
        await axios.delete('http://127.0.0.1:8000/api/users/history/clear/', {
            headers: { 'Authorization': `Token ${token}` }
        });
        setHistory([]); // Clear the list on the screen instantly
        toast.success("History wiped clean!");
    } catch (err) {
        toast.error("Failed to clear history.");
    }
};

// ... in the return statement, above the history map ...
<div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-serif text-stone-800 uppercase tracking-widest">Mood History</h2>
    {history.length > 0 && (
        <button 
            onClick={handleClearHistory}
            className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
        >
            Clear All
        </button>
    )}
</div>

export default Profile;