import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Discovery = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (query = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/discovery/?search=${query}`);
      setBooks(res.data);
    } catch (err) {
      toast.error("The catalogs are jammed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-16 px-8 font-serif">
      <div className="max-w-7xl mx-auto">
        
        {/* Search Drawer Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-light text-[#432818] mb-6">Search the <span className="italic text-[#99582a]">Stacks</span></h1>
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text"
              placeholder="Search by title, author, or 'vibe'..."
              className="w-full bg-white border-2 border-[#ede0d4] rounded-full py-5 px-10 text-xl focus:outline-none focus:border-[#99582a] shadow-inner font-serif italic text-[#7f5539]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchBooks(search)}
            />
            <button 
              onClick={() => fetchBooks(search)}
              className="absolute right-4 top-3 bg-[#99582a] text-white p-3 rounded-full hover:bg-[#7f5539] transition-all"
            >
              🔍
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center italic opacity-40 text-2xl">Pulling drawers from the catalog...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {books.map((book) => (
              <div key={book.id} className="group cursor-pointer">
                {/* Book Spine Aesthetic */}
                <div className="aspect-[2/3] bg-white border border-[#ede0d4] p-4 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-4 transition-all duration-500 relative flex flex-col justify-end overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Decorative "Library Number" */}
                  <div className="absolute top-2 left-2 text-[8px] font-mono opacity-20 group-hover:opacity-100">
                    {book.category?.substring(0,3).toUpperCase()}-{book.id}
                  </div>

                  <h3 className="font-bold text-[#432818] text-sm leading-tight mb-1">{book.title}</h3>
                  <p className="text-[10px] text-[#99582a] italic uppercase tracking-widest">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {books.length === 0 && !loading && (
          <div className="text-center py-20 opacity-30 italic">No volumes found matching your request.</div>
        )}
      </div>
    </div>
  );
};

export default Discovery;