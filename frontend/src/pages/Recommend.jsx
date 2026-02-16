import React, { useState } from 'react';
import axios from 'axios';

const Recommend = () => {
  const [mood, setMood] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/recommend/', { mood });
      setBooks(response.data);
    } catch (err) {
      console.error("Connection to archives lost...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-6 tracking-tight">The <span className="italic text-[#99582a]">Autumn</span> Librarian</h1>
          <p className="text-[#7f5539] italic">“Books are a uniquely portable magic.”</p>
        </div>
        <div className="bg-[#ede0d4] rounded-[2.5rem] p-10 mb-16 shadow-inner border border-[#ddb892]">
          <textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full h-32 p-4 text-xl bg-transparent border-none focus:ring-0 text-[#432818] placeholder-[#b08968] resize-none"
            placeholder="Tell me a story of how you feel..."
          />
          <div className="flex justify-center mt-6">
            <button onClick={handleRecommend} className="bg-[#7f5539] text-[#ede0d4] px-12 py-4 rounded-full uppercase text-sm tracking-widest shadow-xl">
              {loading ? "Searching..." : "Consult Archives"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {books.map((b, i) => (
            <div key={i} className="bg-white p-10 rounded-lg border-l-8 border-[#99582a] shadow-sm transition-transform hover:-translate-y-1">
              <h3 className="text-2xl font-bold mb-2">{b.title}</h3>
              <p className="text-sm italic mb-4 opacity-60">By {b.author}</p>
              <p className="text-sm leading-relaxed opacity-90 line-clamp-4">{b.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommend;