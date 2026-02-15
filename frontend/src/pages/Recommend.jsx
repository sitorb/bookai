import React, { useState, useEffect } from 'react';
import axios from 'axios';

const quotes = [
  "“Autumn is a second spring when every leaf is a flower.” – Albert Camus",
  "“I'm so glad I live in a world where there are Octobers.” – L.M. Montgomery",
  "“Books are a uniquely portable magic.” – Stephen King",
  "“There is a magic in the smell of old books and autumn air.”"
];

const autumnColors = [
  'bg-[#f4e4d4] border-[#e2cbb5] text-[#7a5c43]', 
  'bg-[#e8ece0] border-[#d1d9c5] text-[#5a6b47]', 
  'bg-[#f2e9e4] border-[#d9ccc4] text-[#6d5959]', 
  'bg-[#fefae0] border-[#e9edc9] text-[#606c38]', 
  'bg-[#faedcd] border-[#e9d8a6] text-[#9b722a]'
];

const Recommend = () => {
  const [mood, setMood] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const handleRecommend = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/recommend/', { mood });
      setBooks(response.data);
    } catch (err) {
      console.error("Connection to archives lost. Reconnecting...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-[#432818] mb-6 tracking-tight">
            The <span className="italic text-[#99582a]">Autumn</span> Librarian
          </h1>
          <div className="border-t border-b border-[#e6ccb2] py-4 max-w-xl mx-auto">
            <p className="text-[#7f5539] italic text-lg leading-relaxed">{quote}</p>
          </div>
        </div>

        <div className="bg-[#ede0d4] rounded-[2.5rem] p-10 mb-16 shadow-inner border border-[#ddb892]">
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full h-32 p-4 text-xl bg-transparent border-none focus:ring-0 text-[#432818] placeholder-[#b08968] resize-none"
            placeholder="Tell me a story of how you feel, or the world you wish to find..."
          />
          <div className="flex justify-center mt-6">
            <button 
              onClick={handleRecommend} 
              disabled={loading}
              className="bg-[#7f5539] hover:bg-[#9c6644] text-[#ede0d4] px-12 py-4 rounded-full uppercase text-sm tracking-[0.2em] shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? "Consulting Archives..." : "Seek Wisdom"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {books.map((book, i) => (
            <div key={i} className={`${autumnColors[i % 5]} p-10 rounded-lg border-l-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1`}>
              <h3 className="text-2xl font-bold mb-2 leading-tight">{book.title}</h3>
              <p className="font-medium text-sm mb-6 opacity-80 italic">By {book.author}</p>
              <div className="h-px w-12 bg-current opacity-20 mb-4" />
              <p className="text-sm leading-relaxed opacity-90 line-clamp-6 font-sans">
                {book.summary}
              </p>
            </div>
          ))}
        </div>

        {books.length === 0 && !loading && (
          <div className="text-center mt-20 opacity-20">
            <p className="text-[#7f5539] tracking-[0.5em] uppercase text-xs font-bold">A world of stories awaits your mood</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;