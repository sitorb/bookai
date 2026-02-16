import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/library/')
      .then(res => setBooks(res.data))
      .catch(() => console.log("Archives offline"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-16 px-6 font-serif text-[#432818]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#ede0d4] pb-8 mb-16 gap-4">
          <div>
            <h1 className="text-4xl italic font-light">The Grand Archives</h1>
            <p className="text-[#99582a] text-sm mt-2 font-sans uppercase tracking-widest">
              {books.length > 0 ? `${books.length} Volumes Cataloged` : "Cataloging in progress..."}
            </p>
          </div>
          <button 
            onClick={fetchBooks}
            className="bg-[#7f5539] text-[#ede0d4] px-6 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-[#9c6644] transition-all shadow-md"
          >
            {loading ? "Dusting..." : "Refresh Shelves"}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-[#ede0d4] border-t-[#99582a] rounded-full animate-spin"></div>
            <div className="italic text-[#b08968]">Opening the heavy oak doors...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map(b => (
              <div key={b.id} className="group bg-white p-6 rounded-xl border border-[#ede0d4] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="h-40 bg-[#f4e4d4] rounded-lg mb-4 flex items-center justify-center p-4 text-center overflow-hidden border-b-4 border-[#ddb892]">
                  <h4 className="text-lg font-bold leading-tight group-hover:text-[#99582a] transition-colors line-clamp-3">
                    {b.title}
                  </h4>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-tighter text-[#7f5539] font-bold">Written By</p>
                  <p className="text-sm italic opacity-80">{b.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-20 bg-[#ede0d4]/30 rounded-[3rem] border-2 border-dashed border-[#ede0d4]">
            <p className="italic text-[#b08968] mb-4">The shelves are currently empty.</p>
            <code className="bg-white px-4 py-2 rounded text-xs text-[#7f5539]">python manage.py import_json_books</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;