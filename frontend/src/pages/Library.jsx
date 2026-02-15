import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/recommend/')
      .then(res => setBooks(res.data.slice(0, 12)))
      .catch(() => console.log("Archive access limited"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-16 px-6 font-serif">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 border-b border-[#ede0d4] pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl text-[#432818] font-light italic">The Grand Archives</h1>
            <p className="text-[#9c6644] mt-2 font-sans text-sm tracking-wide">Curating 5,000 volumes of human experience.</p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b08968] font-bold">Established</span>
            <p className="text-[#432818] font-sans">MMXXIV</p>
          </div>
        </header>

        {loading ? (
           <div className="flex justify-center py-40">
             <div className="animate-pulse text-[#7f5539] italic tracking-[0.2em]">Opening the vaults...</div>
           </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {books.map((book) => (
              <div key={book.id} className="group cursor-pointer">
                <div className="aspect-[2/3] bg-[#ede0d4] rounded-sm shadow-md transition-all group-hover:shadow-2xl group-hover:-translate-y-2 border-r-4 border-[#ddb892] flex flex-col justify-end p-6 overflow-hidden relative">
                   <div className="absolute top-0 left-4 w-1 h-full bg-black/5" />
                   <h4 className="text-xl font-bold leading-tight text-[#432818] z-10">{book.title}</h4>
                   <p className="text-xs text-[#7f5539] mt-3 z-10 font-sans tracking-wide uppercase font-bold opacity-60">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;