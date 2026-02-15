import React, { useState, useEffect } from 'react';
import axios from 'axios';

const quotes = [
  "“Autumn is a second spring when every leaf is a flower.” – Albert Camus",
  "“I'm so glad I live in a world where there are Octobers.” – L.M. Montgomery",
  "“A book is a heart that only beats in the chest of another.” – Rebecca Solnit",
  "“There is a special kind of magic in the smell of old books and autumn air.”",
  "“Books are the quietest and most constant of friends.” – Charles W. Eliot"
];

// 5 Autumn-inspired Pastel/Muted Colors
const autumnColors = [
  'bg-[#f4e4d4] border-[#e2cbb5] text-[#7a5c43]', // Muted Pumpkin/Cream
  'bg-[#e8ece0] border-[#d1d9c5] text-[#5a6b47]', // Sage Forest
  'bg-[#f2e9e4] border-[#d9ccc4] text-[#6d5959]', // Dusty Rose/Wood
  'bg-[#fefae0] border-[#e9edc9] text-[#606c38]', // Moss & Earth
  'bg-[#faedcd] border-[#e9d8a6] text-[#9b722a]'  // Harvest Gold
];

const Recommend = () => {
  const [mood, setMood] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const handleRecommend = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/recommend/', { mood });
      setBooks(response.data);
    } catch (err) {
      console.error("Backend error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-[#432818] tracking-tight mb-6">
            The <span className="italic text-[#99582a]">Autumn</span> Librarian
          </h1>
          <div className="max-w-2xl mx-auto border-t border-b border-[#e6ccb2] py-4">
            <p className="text-lg text-[#7f5539] font-light leading-relaxed italic">
              {quote}
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-[#ede0d4] rounded-3xl p-10 mb-16 shadow-inner border border-[#ddb892]">
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full h-32 p-4 text-xl bg-transparent border-none focus:ring-0 resize-none placeholder-[#b08968] text-[#432818]"
            placeholder="Tell me how you're feeling... describe the atmosphere of the story you crave..."
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={handleRecommend}
              disabled={loading}
              className="bg-[#7f5539] hover:bg-[#9c6644] text-[#ede0d4] px-12 py-4 rounded-full font-medium transition-all tracking-widest uppercase text-sm shadow-xl disabled:opacity-50"
            >
              {loading ? "Leafing through pages..." : "Consult the Library"}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {books.map((book, index) => {
            const colorClass = autumnColors[index % autumnColors.length];
            return (
              <div 
                key={book.id} 
                className={`${colorClass} p-10 rounded-lg border-l-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:translate-x-1`}
              >
                <div className="mb-4">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">Entry No. {index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 leading-tight">
                    {book.title}
                </h3>
                <p className="font-medium text-sm mb-6 opacity-80 italic">
                    Written by {book.author}
                </p>
                <p className="text-sm leading-relaxed line-clamp-6 font-sans font-normal border-t border-current pt-4 opacity-90">
                  {book.summary}
                </p>
              </div>
            );
          })}
        </div>

        {books.length === 0 && !loading && (
            <div className="text-center mt-20 opacity-30">
                <p className="text-[#7f5539] tracking-[0.5em] uppercase text-xs">A world of stories awaits your mood</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;