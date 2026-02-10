import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-stone-200 px-6 py-4 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/recommend" className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                    BookAI
                </Link>

                <div className="flex items-center gap-6 font-medium text-stone-600">
                    <Link to="/recommend" className="hover:text-stone-900 transition-colors">Find Books</Link>
                    
                    {token ? (
                        <>
                            <Link to="/library" className="hover:text-stone-900 transition-colors">My Library</Link>
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-stone-200">
                                <span className="text-stone-400 text-sm">Hello, {username}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-stone-900 transition-colors">Login</Link>
                            <Link 
                                to="/register" 
                                className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-all"
                            >
                                Join
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;