// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] = useState({ username: '', email: '', bio: '' });
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        axios.get('http://127.0.0.1:8000/api/users/profile/', {
            headers: { 'Authorization': `Token ${token}` }
        }).then(res => setUserData(res.data))
          .catch(err => console.error(err));
    }, [navigate]);

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        await axios.put('http://127.0.0.1:8000/api/users/profile/', 
            { bio: userData.bio },
            { headers: { 'Authorization': `Token ${token}` }}
        );
        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-stone-50 p-12 text-stone-900">
            <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-stone-200">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-stone-800 text-white rounded-full flex items-center justify-center text-4xl font-serif mx-auto mb-4">
                        {userData.username[0]?.toUpperCase()}
                    </div>
                    <h1 className="text-3xl font-serif">{userData.username}</h1>
                    <p className="text-stone-500">{userData.email}</p>
                </div>

                <div className="border-t border-stone-100 pt-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">Reader Bio</h2>
                    {editing ? (
                        <div className="space-y-4">
                            <textarea 
                                className="w-full p-4 border-2 border-stone-200 rounded-xl outline-none focus:border-stone-800"
                                value={userData.bio}
                                onChange={(e) => setUserData({...userData, bio: e.target.value})}
                            />
                            <button onClick={handleUpdate} className="bg-stone-800 text-white px-6 py-2 rounded-full font-bold">Save Bio</button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-stone-700 leading-relaxed mb-4">{userData.bio || "No bio yet. Tell us what you like to read!"}</p>
                            <button onClick={() => setEditing(true)} className="text-stone-400 hover:text-stone-800 text-sm font-bold underline">Edit Profile</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;