// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/users/register/', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/recommend');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-200">
                <h2 className="text-3xl font-serif text-center mb-8">Join the Club</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4 font-bold">{error}</p>}
                
                <div className="space-y-4">
                    <input 
                        type="text" placeholder="Username" required
                        className="w-full p-4 bg-stone-50 border rounded-xl outline-none focus:border-stone-400"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                    <input 
                        type="email" placeholder="Email (optional)"
                        className="w-full p-4 bg-stone-50 border rounded-xl outline-none focus:border-stone-400"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        className="w-full p-4 bg-stone-50 border rounded-xl outline-none focus:border-stone-400"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button className="w-full bg-stone-800 text-white p-4 rounded-xl font-bold hover:bg-stone-700 transition-all">
                        Create Account
                    </button>
                </div>
                <p className="mt-6 text-center text-stone-500 text-sm">
                    Already have an account? <a href="/login" className="text-stone-800 underline">Login here</a>
                </p>
            </form>
        </div>
    );
};

export default Register;