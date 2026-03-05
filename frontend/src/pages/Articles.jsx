import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  // 1. Fetch articles from the backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        // We include the token so the backend knows if WE liked the article
        const response = await axios.get(`${API_BASE_URL}/api/articles/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setArticles(response.data);
      } catch (err) {
        console.error("Archive fetch error:", err);
        setError("The archives are currently closed for maintenance.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // 2. Handle Heart Toggle
  const handleLike = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to leave a heart.", {
        style: { border: '1px solid #99582a', fontFull: 'serif' }
      });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/articles/${id}/like/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the state locally to show the change immediately
      setArticles(prev => prev.map(article => 
        article.id === id 
          ? { ...article, likes_count: response.data.count, is_liked: response.data.liked } 
          : article
      ));

      if (response.data.liked) {
        toast("Added to favorites", { icon: '❤️' });
      }
    } catch (err) {
      toast.error("Could not process your heart.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-[#ede0d4] pb-8 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-light mb-2 tracking-tight">
              Library <span className="italic text-[#99582a]">Journal</span>
            </h1>
            <p className="text-[#b08968] italic">Musings from the 2.3 million volume archive</p>
          </div>
          
          <Link 
            to="/articles/create"
            className="bg-[#99582a] text-[#fdfaf5] px-8 py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#7f5539] transition-all shadow-md active:scale-95"
          >
            + Write Entry
          </Link>
        </div>

        {/* Loading/Error Logic */}
        {loading && <div className="text-center py-20 italic opacity-50 animate-pulse text-2xl">Searching the shelves...</div>}
        {error && <div className="text-center py-20 text-red-700 italic">{error}</div>}
        {!loading && articles.length === 0 && (
          <div className="text-center py-20 opacity-30 text-2xl italic">The journal pages are currently blank.</div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((post) => (
            <div 
              key={post.id} 
              className="group bg-white rounded-2xl border border-[#ede0d4] shadow-sm overflow-hidden flex flex-col h-[500px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Card Header (Dynamic Visual) */}
              <div className="h-48 bg-gradient-to-br from-[#f3e9dc] to-[#ede0d4] relative flex items-center justify-center p-8 text-center">
                <span className="text-[12rem] font-bold text-[#99582a] opacity-[0.04] absolute select-none pointer-events-none">
                  {post.title[0]}
                </span>
                <div className="z-10">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[#b08968] mb-3">{post.category}</p>
                  <h4 className="text-xl font-bold text-[#7f5539] leading-tight px-4">{post.title}</h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow relative">
                {/* Visual Accent Line */}
                <div className="absolute left-0 top-10 bottom-10 w-1 bg-[#99582a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <p className="text-[10px] text-[#b08968] mb-4 uppercase tracking-[0.2em] font-bold">
                  {formatDate(post.created_at)}
                </p>
                
                <p className="text-[15px] leading-relaxed text-[#7f5539] italic line-clamp-5 mb-6">
                  "{post.content}"
                </p>
                
                {/* Card Footer: Author & Heart */}
                <div className="mt-auto pt-6 border-t border-[#fdfaf5] flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[#b08968] lowercase italic text-[9px] mb-1 leading-none">Archived by</span>
                    <span className="text-[#432818] font-bold uppercase tracking-widest text-[10px]">{post.author_name}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 group/heart"
                    >
                      <span className={`text-xl transition-all duration-300 group-hover/heart:scale-125 ${post.is_liked ? 'text-red-500' : 'text-stone-300'}`}>
                        {post.is_liked ? '❤️' : '♡'}
                      </span>
                      <span className="text-[11px] font-bold text-stone-400 group-hover/heart:text-stone-600">
                        {post.likes_count || 0}
                      </span>
                    </button>
                    <span className="text-stone-200 text-lg font-light">|</span>
                    <span className="text-[#99582a] text-[10px] font-bold uppercase tracking-tighter cursor-pointer hover:underline">Read →</span>
                  </div>
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