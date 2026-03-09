import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    toast.success("Logged out of the archives.");
    navigate('/login');
  };

  return (
    <nav className="bg-[#fdfaf5] border-b border-[#ede0d4] py-4 px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-xl font-serif text-[#432818] tracking-tight">
          The <span className="italic text-[#99582a] font-bold">Autumn</span> Librarian
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-[#b08968]">
          <Link to="/recommend" className="hover:text-[#99582a] transition-colors">Consult</Link>
          <Link to="/discovery" className="hover:text-[#99582a] transition-colors">Discovery</Link>
          {/* This is the new link you need! */}
          <Link to="/articles" className="hover:text-[#99582a] transition-colors text-[#99582a]">Journal</Link>
          
          {token ? (
            <>
              <Link to="/library" className="hover:text-[#99582a] transition-colors">Library</Link>
              <Link to="/profile" className="hover:text-[#99582a] transition-colors">Profile</Link>
              <button 
                onClick={handleLogout}
                className="border border-[#ede0d4] px-4 py-1 rounded-full hover:bg-[#99582a] hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-[#99582a] text-white px-5 py-1.5 rounded-full hover:bg-[#7f5539] transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;