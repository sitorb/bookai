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
    <nav className="bg-[#fdfaf5] border-b border-[#ede0d4] px-12 py-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      
      {/* Brand Label */}
      <Link to="/recommend" className="flex-shrink-0">
        <h1 className="text-2xl font-serif text-[#432818] tracking-tight">
          The <span className="italic text-[#99582a]">Autumn</span> Librarian
        </h1>
      </Link>
      
      {/* Navigation Links - FIXED SPACING HERE */}
      <div className="flex items-center gap-x-10 font-serif text-[11px] uppercase tracking-[0.2em] text-[#7f5539]">
        
        <Link to="/recommend" className="hover:text-[#99582a] transition-all whitespace-nowrap">
          Discover
        </Link>
        
        <Link to="/articles" className="hover:text-[#99582a] transition-all whitespace-nowrap">
          Journal
        </Link>
        
        <Link to="/discovery" className="hover:text-[#99582a] transition-all whitespace-nowrap">
          Community
        </Link>

        {/* Auth Dependent Section */}
        {token ? (
          <div className="flex items-center gap-x-8 border-l border-[#ede0d4] pl-8">
            <Link to="/library" className="hover:text-[#432818] transition-colors">Library</Link>
            <Link to="/profile" className="hover:text-[#432818] transition-colors">Profile</Link>
            
            <div className="flex items-center gap-x-4">
              <span className="text-[10px] text-[#b08968] lowercase italic opacity-70">
                {username}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-[#99582a] text-[10px] font-bold hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="ml-4 bg-[#432818] text-[#fdfaf5] px-6 py-2 rounded-full hover:bg-[#99582a] transition-all text-[10px] tracking-widest"
          >
            Enter Archives
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;