import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Django Rest Framework Token Auth endpoint
            const res = await axios.post('http://127.0.0.1:8000/api/token/', credentials);
            
            // Save token and username for the Navbar and Library access
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', credentials.username);
            
            navigate('/recommend'); 
        } catch (err) {
            setError('Invalid username or password. Please try again.');
            console.error("Login error:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 text-stone-900">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-stone-200">
                <h2 className="text-4xl font-serif text-center mb-8">Welcome Back</h2>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 font-medium border border-red-100">
                        {error}
                    </div>
                )}
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wider">Username</label>
                        <input 
                            type="text" 
                            required
                            className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl outline-none focus:border-stone-800 transition-all"
                            placeholder="Enter your username"
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wider">Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl outline-none focus:border-stone-800 transition-all"
                            placeholder="••••••••"
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                    </div>
                    <button className="w-full bg-stone-800 text-white p-4 rounded-xl font-bold hover:bg-stone-700 transition-all shadow-lg active:scale-95">
                        Sign In
                    </button>
                </div>
                
                <p className="mt-8 text-center text-stone-500">
                    Don't have an account? <a href="/register" className="text-stone-800 font-bold underline">Join the club</a>
                </p>
            </form>
        </div>
    );
};

export default Login;