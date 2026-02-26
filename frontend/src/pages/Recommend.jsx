import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
      // Отправляем объект { mood: "текст" }
      const response = await axios.post(`${API_BASE_URL}/recommend/`, { mood });
      setBooks(response.data);
      
      if (response.data.length === 0) {
        setError("Архивариус обыскал все полки, но ничего не нашел. Попробуйте описать иначе.");
      }
    } catch (err) {
      console.error("Connection lost:", err);
      setError("Связь с библиотекой прервана. Проверьте сервер Django.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleRecommend();
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
            The <span className="italic text-[#99582a]">Autumn</span> Librarian
          </h1>
        </div>

        {/* Поле ввода */}
        <div className="bg-[#ede0d4] rounded-[2.5rem] p-8 md:p-12 mb-16 shadow-inner border border-[#ddb892]">
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-32 p-4 text-xl bg-transparent border-none focus:ring-0 text-[#432818] placeholder-[#b08968] resize-none"
            placeholder="Tell me a story of how you feel..."
          />
          <div className="flex flex-col items-center mt-6">
            <button 
              onClick={handleRecommend} 
              disabled={loading || !mood.trim()}
              className="bg-[#7f5539] text-[#ede0d4] px-12 py-4 rounded-full uppercase text-sm tracking-widest hover:bg-[#99582a] transition-all"
            >
              {loading ? "Searching Shelves..." : "Consult Archives"}
            </button>
          </div>
        </div>

        {/* Сетка результатов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {books.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#ede0d4] overflow-hidden flex flex-col h-[500px] hover:shadow-xl transition-all">
              <div className="h-2/3 bg-[#fdfaf5] flex items-center justify-center relative">
                {/* Исправлено: используем b.cover_image */}
                {b.cover_image ? (
                  <img src={b.cover_image} alt={b.title} className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="opacity-20 text-center">
                    <span className="text-6xl font-bold">{b.title[0]}</span>
                    <p className="text-[10px] uppercase">No Cover</p>
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-grow relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#99582a]" />
                <h3 className="text-xl font-bold line-clamp-1">{b.title}</h3>
                <p className="text-xs italic text-[#b08968] mb-2">by {b.author}</p>
                <p className="text-sm italic text-[#7f5539] line-clamp-3">"{b.summary}"</p>
                <div className="mt-auto pt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#99582a]">
                  <span>Request Volume</span>
                  {b.publication_year && <span className="text-[#b08968]">{b.publication_year}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommend;