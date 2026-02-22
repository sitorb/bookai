import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Рекомендую вынести это в .env или отдельный файл конфигурации
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const Recommend = () => {
  const [mood, setMood] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция для отправки запроса
  const handleRecommend = async () => {
    if (!mood.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Отправляем запрос на эндпоинт, указанный в твоем views.py
      const response = await axios.post(`${API_BASE_URL}/recommend/`, { mood });
      setBooks(response.data);
      
      if (response.data.length === 0) {
        setError("Архивариус не нашел ничего подходящего... Попробуйте сменить описание.");
      }
    } catch (err) {
      console.error("Connection to archives lost...");
      setError("Связь с библиотекой прервана. Проверьте, запущен ли сервер.");
    } finally {
      setLoading(false);
    }
  };

  // Обработка Ctrl + Enter для удобства
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleRecommend();
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-6 tracking-tight">
            The <span className="italic text-[#99582a]">Autumn</span> Librarian
          </h1>
          <p className="text-[#7f5539] italic">“Books are a uniquely portable magic.”</p>
        </div>

        {/* Input Area */}
        <div className="bg-[#ede0d4] rounded-[2.5rem] p-10 mb-16 shadow-inner border border-[#ddb892]">
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-32 p-4 text-xl bg-transparent border-none focus:ring-0 text-[#432818] placeholder-[#b08968] resize-none"
            placeholder="Опишите ваше настроение (напр. 'меланхолия и космос' или 'уютный детектив')..."
          />
          <div className="flex flex-col items-center mt-6">
            <button 
              onClick={handleRecommend} 
              disabled={loading || !mood.trim()}
              className={`bg-[#7f5539] text-[#ede0d4] px-12 py-4 rounded-full uppercase text-sm tracking-widest shadow-xl transition-all
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#99582a] active:scale-95'}`}
            >
              {loading ? "Browsing Shelves..." : "Consult Archives"}
            </button>
            <p className="mt-3 text-xs text-[#b08968] uppercase tracking-tighter">
              Press Ctrl + Enter to submit
            </p>
          </div>
        </div>

        {/* Error/Empty Message */}
        {error && (
          <div className="text-center p-8 bg-orange-50 border border-orange-200 rounded-xl mb-10 text-[#99582a]">
            {error}
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {books.map((b, i) => (
            <div 
              key={i} 
              className="group bg-white p-10 rounded-lg border-l-8 border-[#99582a] shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold leading-tight group-hover:text-[#99582a] transition-colors">
                  {b.title}
                </h3>
                {b.publication_year && (
                  <span className="text-xs bg-[#fdfaf5] px-2 py-1 rounded border border-[#ddb892]">
                    {b.publication_year}
                  </span>
                )}
              </div>
              <p className="text-sm italic mb-6 opacity-60">By {b.author}</p>
              <p className="text-sm leading-relaxed opacity-90 line-clamp-4">
                {b.summary}
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button className="text-[#99582a] text-xs font-bold uppercase tracking-widest hover:underline">
                  Read Details
                </button>
                <div className="flex gap-2">
                   {/* Здесь можно добавить иконки настроений из БД */}
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