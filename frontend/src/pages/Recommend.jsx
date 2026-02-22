import React, { useState } from 'react';
import axios from 'axios';

// Настройка базового URL для API
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
      const response = await axios.post(`${API_BASE_URL}/recommend/`, { mood });
      setBooks(response.data);
      
      if (response.data.length === 0) {
        setError("Архивариус обыскал все полки, но ничего не нашел. Попробуйте описать иначе.");
      }
    } catch (err) {
      console.error("Connection to archives lost...");
      setError("Связь с библиотекой прервана. Проверьте соединение с сервером.");
    } finally {
      setLoading(false);
    }
  };

  // Горячая клавиша: Ctrl + Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleRecommend();
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-5xl mx-auto">
        
        {/* Шапка (Header) */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
            The <span className="italic text-[#99582a]">Autumn</span> Librarian
          </h1>
          <p className="text-[#7f5539] italic text-lg">“Books are a uniquely portable magic.”</p>
        </div>

        {/* Поле ввода (Input Area) */}
        <div className="bg-[#ede0d4] rounded-[2.5rem] p-8 md:p-12 mb-16 shadow-inner border border-[#ddb892] relative">
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
              className={`bg-[#7f5539] text-[#ede0d4] px-12 py-4 rounded-full uppercase text-sm tracking-widest shadow-2xl transition-all duration-300
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#99582a] hover:-translate-y-1 active:scale-95'}`}
            >
              {loading ? "Searching Shelves..." : "Consult Archives"}
            </button>
            <p className="mt-4 text-[10px] text-[#b08968] uppercase tracking-[0.2em]">
              Press <span className="font-bold">Ctrl + Enter</span> to search
            </p>
          </div>
        </div>

        {/* Сообщения об ошибках */}
        {error && (
          <div className="text-center p-6 bg-white border-l-4 border-[#99582a] rounded-r-lg mb-12 shadow-sm italic text-[#7f5539]">
            {error}
          </div>
        )}

        {/* Сетка результатов (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {books.map((b, i) => (
            <div 
              key={i} 
              className="group bg-white rounded-2xl border border-[#ede0d4] shadow-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-[500px]"
            >
              {/* Секция обложки */}
              <div className="h-2/3 bg-[#fdfaf5] relative overflow-hidden flex items-center justify-center">
                {b.image_url ? (
                  <img 
                    src={b.image_url} 
                    alt={b.title} 
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = ""; }} 
                  />
                ) : (
                  <div className="flex flex-col items-center opacity-20">
                    <span className="text-8xl font-bold uppercase">{b.title[0]}</span>
                    <p className="text-xs uppercase tracking-widest mt-2">No Cover Found</p>
                  </div>
                )}
                {/* Легкий градиент поверх для стиля */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>

              {/* Секция контента */}
              <div className="p-8 flex flex-col flex-grow bg-white relative">
                {/* Декоративная полоса слева */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#99582a]" />
                
                <div className="mb-3">
                  <h3 className="text-xl font-bold leading-tight group-hover:text-[#99582a] transition-colors line-clamp-1">
                    {b.title}
                  </h3>
                  <p className="text-xs italic text-[#b08968] mt-1">Written by {b.author}</p>
                </div>

                <p className="text-sm leading-relaxed text-[#7f5539] line-clamp-3 mb-4 italic">
                  "{b.summary}"
                </p>

                <div className="mt-auto pt-4 border-t border-[#fdfaf5] flex justify-between items-center">
                  <button className="text-[#99582a] text-[10px] font-bold uppercase tracking-widest hover:text-[#432818] transition-colors">
                    Request Volume
                  </button>
                  {b.publication_year && (
                    <span className="text-[10px] px-2 py-1 bg-[#fdfaf5] border border-[#ede0d4] text-[#b08968] rounded">
                      {b.publication_year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer-заглушка для пустого состояния */}
        {!loading && books.length === 0 && !error && (
          <div className="text-center py-20 opacity-20 select-none">
            <p className="text-4xl italic">The archives are quiet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;