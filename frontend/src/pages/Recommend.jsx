import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Базовый URL сервера

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
      const response = await axios.post(`${API_BASE_URL}/api/recommend/`, { mood });
      setBooks(response.data);
      if (response.data.length === 0) setError("Архивариус ничего не нашел.");
    } catch (err) {
      setError("Ошибка связи с библиотекой.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl text-center mb-12 font-light">The <span className="italic text-[#99582a]">Autumn</span> Librarian</h1>
        
        {/* Поле ввода */}
        <div className="bg-[#ede0d4] rounded-3xl p-8 mb-16 shadow-inner border border-[#ddb892] text-center">
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full h-24 bg-transparent border-none focus:ring-0 text-xl resize-none"
            placeholder="Tell me a story of how you feel..."
          />
          <button 
            onClick={handleRecommend}
            className="mt-4 bg-[#7f5539] text-white px-10 py-3 rounded-full hover:bg-[#99582a] transition-all"
          >
            {loading ? "Searching..." : "Consult Archives"}
          </button>
        </div>

        {/* Сетка результатов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((b, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-[#ede0d4] overflow-hidden flex flex-col hover:shadow-lg transition-all">
              <div className="h-64 bg-[#fdfaf5] flex items-center justify-center border-b">
                {b.cover_image ? (
                  <img 
                    src={b.cover_image.startsWith('http') ? b.cover_image : `${API_BASE_URL}${b.cover_image}`} 
                    alt={b.title} 
                    className="h-full w-full object-contain p-2" 
                  />
                ) : (
                  <div className="text-center opacity-20">NO COVER</div>
                )}
              </div>
              <div className="p-6 flex-grow">
                <h3 className="font-bold text-lg line-clamp-1">{b.title}</h3>
                <p className="text-xs text-[#b08968] mb-2">by {b.author}</p>
                <p className="text-sm italic text-[#7f5539] line-clamp-4">"{b.summary}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommend;