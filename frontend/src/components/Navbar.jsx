import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || "guest";

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-[#fdfaf5]/90 backdrop-blur-md border-b border-[#ede0d4] px-8 md:px-16 py-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      
      {/* Логотип */}
      <Link to="/" className="flex-shrink-0 group">
        <h1 className="text-2xl md:text-3xl font-serif text-[#432818] tracking-tight transition-all group-hover:opacity-80">
          The <span className="italic text-[#99582a]">Autumn</span> Librarian
        </h1>
      </Link>
      
      {/* Навигация */}
      <div className="hidden lg:flex items-center gap-x-12 font-serif text-[12px] uppercase tracking-[0.15em] text-[#7f5539]">
        
        <Link to="/recommend" className="hover:text-[#99582a] transition-all relative group py-2">
          Discover
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#99582a] transition-all group-hover:w-full"></span>
        </Link>
        
        <Link to="/articles" className="hover:text-[#99582a] transition-all relative group py-2">
          Journal
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#99582a] transition-all group-hover:w-full"></span>
        </Link>
        
        <Link to="/discovery" className="hover:text-[#99582a] transition-all relative group py-2">
          Community
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#99582a] transition-all group-hover:w-full"></span>
        </Link>

        {/* Секция профиля */}
        {token ? (
          <div className="flex items-center gap-x-8 ml-4 border-l border-[#ede0d4] pl-10">
            <div className="flex gap-x-6 text-[#432818] font-medium uppercase tracking-widest text-[10px]">
              <Link to="/library" className="hover:text-[#99582a] transition-colors">Library</Link>
              <Link to="/profile" className="hover:text-[#99582a] transition-colors">Profile</Link>
            </div>
            
            <div className="flex items-center gap-x-5 bg-[#ede0d4]/40 px-5 py-2 rounded-full border border-[#ddb892]/50">
              <span className="text-[11px] text-[#432818] font-bold lowercase italic">
                @{username}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-[#99582a] text-[10px] font-black uppercase tracking-widest hover:text-[#432818] transition-colors border-l border-[#ddb892] pl-4"
              >
                Exit
              </button>
            </div>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="ml-8 bg-[#432818] text-[#fdfaf5] px-8 py-3 rounded-full hover:bg-[#99582a] transition-all text-[11px] tracking-[0.2em] shadow-md"
          >
            ENTER ARCHIVES
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;