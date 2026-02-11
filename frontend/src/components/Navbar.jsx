import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
            <Link to="/recommend" className="text-2xl font-serif font-bold text-stone-900">BookAI</Link>
            <div className="flex gap-6 items-center font-medium text-stone-600">
                <Link to="/recommend" className="hover:text-stone-900">Discover</Link>
                {token ? (
                    <>
                        <Link to="/library" className="hover:text-stone-900">Library</Link>
                        <Link to="/profile" className="hover:text-stone-900">Profile</Link>
                        <button onClick={handleLogout} className="text-red-500 text-sm font-bold ml-4 border border-red-100 px-3 py-1 rounded-md hover:bg-red-50">
                            Logout ({username})
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="bg-stone-800 text-white px-4 py-2 rounded-lg">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;