import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/articles/`);
        setArticles(response.data);
      } catch (err) {
        console.error("Archive fetch error:", err);
        setError("The archives are temporarily unreachable.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Helper to format the Django date (2025-10-12T...) into a library style
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-[#ede0d4] pb-8 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-light mb-2 tracking-tight">
              Library <span className="italic text-[#99582a]">Journal</span>
            </h1>
            <p className="text-[#b08968] italic tracking-wide">Community musings and archival notes</p>
          </div>
          
          <Link 
            to="/articles/create"
            className="bg-[#99582a] text-[#fdfaf5] px-8 py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#7f5539] transition-all shadow-md active:scale-95"
          >
            + Write Entry
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40 italic">
            <div className="animate-pulse mb-4">Consulting the shelves...</div>
            <div className="w-24 h-0.5 bg-[#99582a]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 text-red-800 italic">{error}</div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-20 opacity-20 text-3xl italic">
            The journal is currently blank. Be the first to write.
          </div>
        )}

        {/* Articles Grid  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((post) => (
            <div 
              key={post.id} 
              className="group bg-white rounded-xl border border-[#ede0d4] shadow-sm overflow-hidden flex flex-col h-[480px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
            >
              {/* Dynamic Bookplate Cover */}
              <div className="h-52 bg-gradient-to-br from-[#f3e9dc] to-[#ede0d4] relative flex items-center justify-center p-8 text-center border-b border-[#fdfaf5]">
                <span className="text-[12rem] font-bold text-[#99582a] opacity-[0.03] absolute select-none pointer-events-none">
                  {post.title[0]}
                </span>
                <div className="z-10">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[#b08968] mb-3">{post.category}</p>
                  <h4 className="text-xl font-bold text-[#7f5539] leading-tight px-2">{post.title}</h4>
                  <div className="w-8 h-0.5 bg-[#99582a] mx-auto mt-4 opacity-30 group-hover:w-16 transition-all duration-700"></div>
                </div>
              </div>

              {/* Entry Summary */}
              <div className="p-8 flex flex-col flex-grow relative">
                <div className="absolute left-0 top-8 bottom-8 w-1 bg-[#99582a] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <p className="text-[10px] text-[#b08968] mb-4 uppercase tracking-[0.2em]">
                  {formatDate(post.created_at)}
                </p>
                
                <p className="text-[15px] leading-relaxed text-[#7f5539] italic line-clamp-4 mb-6">
                  "{post.content}"
                </p>
                
                <div className="mt-auto pt-6 border-t border-[#fdfaf5] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex flex-col">
                    <span className="text-[#b08968] font-normal lowercase italic text-[9px] mb-1">Archived by</span>
                    <span className="text-[#432818]">{post.author_name}</span>
                  </div>
                  <span className="text-[#99582a] group-hover:translate-x-1 transition-transform">Read Entry →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;