import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    toast.success("Signed out of the archives.");
    navigate('/login');
  };

  return (
    <nav className="bg-[#fdfaf5] border-b border-[#ede0d4] py-4 px-8 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand/Logo */}
        <Link to="/" className="text-xl font-serif text-[#432818] tracking-tight group">
          The <span className="italic text-[#99582a] font-bold group-hover:text-[#7f5539] transition-colors">Autumn</span> Librarian
        </Link>

        {/* Navigation Links - The 'gap-8' here is what fixes the squishing */}
        <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-[#b08968]">
          <Link to="/recommend" className="hover:text-[#99582a] transition-colors">Consult</Link>
          <Link to="/discovery" className="hover:text-[#99582a] transition-colors">Discovery</Link>
          <Link to="/articles" className="text-[#99582a] border-b border-[#99582a] pb-1">Journal</Link>
          
          {token ? (
            <>
              <Link to="/library" className="hover:text-[#99582a] transition-colors">Library</Link>
              <Link to="/profile" className="hover:text-[#99582a] transition-colors">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-stone-100 px-4 py-1.5 rounded-full text-[#7f5539] hover:bg-[#99582a] hover:text-white transition-all border border-[#ede0d4]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-[#99582a] text-white px-6 py-2 rounded-full hover:bg-[#7f5539] transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;