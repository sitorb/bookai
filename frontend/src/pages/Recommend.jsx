import React, { useState } from 'react';
import axios from 'axios';

// Ensure this matches your Django server address
const API_BASE_URL = 'http://127.0.0.1:8000';

const Recommend = () => {
  const [mood, setMood] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecommend = async () => {
    if (!mood.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Sending 'mood' as expected by your updated Django views
      const response = await axios.post(`${API_BASE_URL}/api/recommend/`, { mood });
      setBooks(response.data);
      
      if (response.data.length === 0) {
        setError("The Librarian searched every shelf but found nothing. Try describing your feelings differently.");
      }
    } catch (err) {
      console.error("Connection to archives lost:", err);
      setError("Connection to the library was interrupted. Please check if the Django server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Shortcut: Ctrl + Enter to trigger search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleRecommend();
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-tight">
            The <span className="italic text-[#99582a]">Autumn</span> Librarian
          </h1>
          <p className="text-[#7f5539] italic text-lg opacity-80">“Books are a uniquely portable magic.”</p>
        </div>

        {/* Search Input Area */}
        <div className="bg-[#ede0d4] rounded-[2rem] p-8 md:p-10 mb-12 shadow-inner border border-[#ddb892] relative">
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-28 p-4 text-xl bg-transparent border-none focus:ring-0 text-[#432818] placeholder-[#b08968] resize-none"
            placeholder="Tell me a story of how you feel..."
          />
          
          <div className="flex flex-col items-center mt-4">
            <button 
              onClick={handleRecommend} 
              disabled={loading || !mood.trim()}
              className={`bg-[#7f5539] text-[#ede0d4] px-10 py-3 rounded-full uppercase text-sm tracking-widest shadow-lg transition-all duration-300
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#99582a] hover:-translate-y-0.5 active:scale-95'}`}
            >
              {loading ? "Consulting Archives..." : "Consult Archives"}
            </button>
            <p className="mt-3 text-[10px] text-[#b08968] uppercase tracking-[0.2em]">
              Press <span className="font-bold">Ctrl + Enter</span> to search
            </p>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="text-center p-4 bg-white border-l-4 border-[#99582a] rounded-r-lg mb-8 shadow-sm italic text-[#7f5539]">
            {error}
          </div>
        )}

        {/* Results Grid - Table of Books Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((b, i) => (
            <div 
              key={i} 
              className="group bg-white rounded-xl border border-[#ede0d4] shadow-sm overflow-hidden flex flex-col h-[450px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Cover Image Area (Small Pictures) */}
              <div className="h-48 bg-[#fdfaf5] relative overflow-hidden flex items-center justify-center border-b border-[#f3e9dc]">
                {b.cover_image ? (
                  <img 
                    src={b.cover_image.startsWith('http') ? b.cover_image : `${API_BASE_URL}${b.cover_image}`} 
                    alt={b.title} 
                    className="h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = ""; }} 
                  />
                ) : (
                  <div className="flex flex-col items-center opacity-30">
                    <span className="text-5xl font-bold uppercase text-[#99582a]">{b.title[0]}</span>
                    <p className="text-[10px] uppercase tracking-widest mt-2">No Cover Found</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>

              {/* Book Details Area */}
              <div className="p-5 flex flex-col flex-grow relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#99582a]" />
                
                <div className="mb-2">
                  <h3 className="text-sm font-bold leading-tight text-[#432818] line-clamp-2 min-h-[2.5rem]">
                    {b.title}
                  </h3>
                  <p className="text-[11px] italic text-[#99582a] mt-1 truncate">
                    Written by {b.author || 'Unknown'}
                  </p>
                </div>

                <p className="text-xs leading-relaxed text-[#7f5539] line-clamp-4 mb-4 italic flex-grow">
                  "{b.summary || "No description available in the archives..."}"
                </p>

                {/* Technical Table Info Footer */}
                <div className="mt-auto pt-3 border-t border-[#fdfaf5] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#b08968]">
                  <span className="text-[#99582a]">ID: {b.id}</span>
                  {b.publication_year && (
                    <span className="px-2 py-0.5 bg-[#fdfaf5] border border-[#ede0d4] rounded">
                      {b.publication_year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && books.length === 0 && !error && (
          <div className="text-center py-20 opacity-20 select-none">
            <p className="text-3xl italic font-light">The archives are quiet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;