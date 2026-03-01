import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.clear(); // Clears token and user info
        navigate('/login'); // Redirects to login page
    };

    return (
        <nav className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
            {/* Branding - Leads back to the main recommendation engine */}
            <Link to="/recommend" className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                The <span className="italic text-[#99582a]">Autumn</span> Librarian
            </Link>
            
            <div className="flex gap-8 items-center font-serif text-sm uppercase tracking-widest text-stone-500">
                {/* --- Public Links (Visible to everyone) --- */}
                <Link to="/recommend" className="hover:text-[#99582a] transition-colors">Discover</Link>
                
                {/* NEW: Link to your Articles/Journal page */}
                <Link to="/articles" className="hover:text-[#99582a] transition-colors">Journal</Link>
                
                <Link to="/discovery" className="hover:text-stone-900 transition-colors">Community</Link>

                {/* --- Auth Links (Conditional based on token) --- */}
                {token ? (
                    <>
                        <Link to="/library" className="hover:text-stone-900 transition-colors">Library</Link>
                        <Link to="/profile" className="hover:text-stone-900 transition-colors">Profile</Link>
                        
                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-stone-200">
                            <span className="text-[10px] text-stone-400 normal-case italic">
                                Welcome, {username}
                            </span>
                            <button 
                                onClick={handleLogout} 
                                className="text-red-600 text-[10px] font-bold border border-red-100 px-3 py-1 rounded-full hover:bg-red-50 transition-all uppercase tracking-tighter"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link 
                            to="/login" 
                            className="bg-stone-800 text-white px-6 py-2 rounded-full hover:bg-[#7f5539] transition-all text-[10px]"
                        >
                            Enter Archives
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;