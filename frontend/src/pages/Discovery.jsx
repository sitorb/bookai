import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Discovery = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const API_URL = 'http://127.0.0.1:8000/api/books';

  const fetchBooks = async (query = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/discovery/?q=${query}`);
      setBooks(res.data);
    } catch (err) {
      toast.error("The catalogs are jammed.");
    } finally {
      setLoading(false);
    }
  };

  const consultOracle = async () => {
    setIsShuffling(true);
    // Artificial delay to make it feel like the librarian is searching the deep stacks
    setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/discovery/random/`);
        setBooks([res.data]); // Focus on just this one lucky find
        toast("The Oracle has spoken.", { icon: '🔮' });
      } catch (err) {
        toast.error("The Oracle is silent today.");
      } finally {
        setIsShuffling(false);
      }
    }, 800);
  };

  useEffect(() => { fetchBooks(); }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-16 px-8 font-serif">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-[#432818] mb-6">Discovery <span className="italic text-[#99582a]">Hall</span></h1>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto items-center">
            <div className="relative flex-grow">
              <input 
                type="text"
                placeholder="Search the 2.3 million volumes..."
                className="w-full bg-white border-2 border-[#ede0d4] rounded-full py-4 px-8 focus:outline-none focus:border-[#99582a] shadow-inner italic"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchBooks(search)}
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => fetchBooks(search)}
                className="bg-[#99582a] text-white px-8 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#7f5539] transition-all"
              >
                Search
              </button>
              
              <button 
                onClick={consultOracle}
                disabled={isShuffling}
                className={`border-2 border-[#99582a] text-[#99582a] px-6 py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#99582a] hover:text-white transition-all ${isShuffling ? 'animate-pulse opacity-50' : ''}`}
              >
                {isShuffling ? "Consulting..." : "Oracle 🔮"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={`grid gap-8 ${books.length === 1 ? 'max-w-md mx-auto' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'}`}>
          {books.map((book) => (
            <div 
              key={book.id} 
              className={`bg-white border border-[#ede0d4] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-end min-h-[300px] relative ${books.length === 1 ? 'border-t-8 border-t-[#99582a] scale-110' : ''}`}
            >
              {books.length === 1 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#99582a] text-[#fdfaf5] px-4 py-1 rounded-full text-[8px] uppercase tracking-[0.3em]">
                  Recommended Find
                </div>
              )}
              
              <span className="font-mono text-[9px] opacity-20 absolute top-4 left-4">CAT-{book.id}</span>
              <h3 className="font-bold text-[#432818] text-lg leading-tight mb-2">{book.title}</h3>
              <p className="text-[10px] text-[#99582a] uppercase tracking-widest font-bold mb-4">{book.author}</p>
              
              <button className="w-full border border-[#ede0d4] py-2 text-[10px] uppercase tracking-tighter hover:bg-[#fdfaf5]">
                View Details
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Discovery;