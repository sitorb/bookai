import React, { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.post(`${API_BASE_URL}/api/library/recommend/`, { mood });
      setBooks(response.data);
      if (response.data.length === 0) {
        setError("The Librarian searched every shelf but found nothing. Try a different description.");
      }
    } catch (err) {
      setError("Connection to the library was interrupted.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleRecommend();
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-tight">
            The <span className="italic text-[#99582a]">Autumn</span> Librarian
          </h1>
          <p className="text-[#7f5539] italic text-lg opacity-80">“Books are a uniquely portable magic.”</p>
        </div>

        {/* Input Area */}
        <div className="bg-[#ede0d4] rounded-[2rem] p-8 md:p-10 mb-12 shadow-inner border border-[#ddb892] max-w-3xl mx-auto">
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-28 p-4 text-xl bg-transparent border-none focus:ring-0 text-[#432818] placeholder-[#b08968] resize-none text-center"
            placeholder="Tell me a story of how you feel..."
          />
          <div className="flex flex-col items-center mt-4">
            <button 
              onClick={handleRecommend} 
              disabled={loading || !mood.trim()}
              className="bg-[#7f5539] text-[#ede0d4] px-10 py-3 rounded-full uppercase text-sm tracking-widest shadow-lg hover:bg-[#99582a] transition-all"
            >
              {loading ? "Consulting Archives..." : "Consult Archives"}
            </button>
          </div>
        </div>

        {/* Results Grid - Table of Books with Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((b, i) => (
            <div 
              key={i} 
              className="group bg-white rounded-xl border border-[#ede0d4] shadow-sm overflow-hidden flex flex-col h-[500px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Cover Area: Image or Dynamic Placeholder */}
              <div className="h-64 bg-[#f3e9dc] relative overflow-hidden flex items-center justify-center border-b border-[#ede0d4]">
                {b.cover_image ? (
                  <img 
                    src={b.cover_image.startsWith('http') ? b.cover_image : `${API_BASE_URL}${b.cover_image}`} 
                    alt={b.title} 
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  /* Dynamic Title Placeholder */
                  <div className="flex flex-col items-center justify-center p-6 text-center h-full w-full bg-gradient-to-br from-[#ede0d4] to-[#f3e9dc]">
                    <span className="text-7xl font-bold text-[#99582a] opacity-20 absolute top-4 left-4 select-none">
                      {b.title[0]}
                    </span>
                    <h4 className="text-lg font-bold text-[#7f5539] leading-tight mb-2 z-10">
                      {b.title}
                    </h4>
                    <div className="w-8 h-0.5 bg-[#99582a] opacity-40 mb-2"></div>
                    <p className="text-[10px] uppercase tracking-widest text-[#b08968] z-10">
                      Archive Vol. {b.id}
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>

              {/* Details Area */}
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#99582a]" />
                
                <div className="mb-3">
                  <h3 className="text-md font-bold text-[#432818] line-clamp-2 min-h-[2.5rem]">
                    {b.title}
                  </h3>
                  <p className="text-xs italic text-[#99582a] mt-1">
                    by {b.author || 'Unknown Author'}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-[#7f5539] line-clamp-4 italic mb-4">
                  "{b.summary || "No description available in the archives..."}"
                </p>

                <div className="mt-auto pt-4 border-t border-[#fdfaf5] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#b08968]">
                  <span>Index No. {b.id}</span>
                  {b.publication_year && <span>{b.publication_year}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && books.length === 0 && !error && (
          <div className="text-center py-20 opacity-20 select-none italic text-3xl">
            The archives are quiet...
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;