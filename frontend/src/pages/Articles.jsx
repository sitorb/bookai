import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the ID stored during login to identify the author
  const currentUserId = localStorage.getItem('user_id'); 
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // 1. Fetching the Archives
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        // Passing the token ensures 'is_liked' is accurate for the logged-in user
        const response = await axios.get(`${API_BASE_URL}/api/articles/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setArticles(response.data);
      } catch (err) {
        console.error("Archive Error:", err);
        setError("The library stacks are currently inaccessible.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // 2. The Heart (Like) Interaction
  const handleLike = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be a registered member to heart an entry.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/articles/${id}/like/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Instantly update the card without refreshing the page
      setArticles(prev => prev.map(article => 
        article.id === id 
          ? { ...article, likes_count: response.data.count, is_liked: response.data.liked } 
          : article
      ));

      if (response.data.liked) {
        toast("Entry favorited", { icon: '❤️' });
      }
    } catch (err) {
      toast.error("The archival ink failed to bond. Try again.");
    }
  };

  // 3. The "Strike from Record" (Delete) Interaction
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm("Are you certain you wish to remove this entry from the permanent record?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/articles/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(prev => prev.filter(article => article.id !== id));
      toast.success("Entry successfully removed.");
    } catch (err) {
      toast.error("You lack the authority to strike this entry.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-6 font-serif text-[#432818]">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-[#ede0d4] pb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-light mb-3 tracking-tight">
              Library <span className="italic text-[#99582a]">Journal</span>
            </h1>
            <p className="text-[#b08968] italic opacity-80">Reflections and community findings</p>
          </div>
          
          <Link 
            to="/articles/create"
            className="bg-[#99582a] text-[#fdfaf5] px-10 py-3 rounded-full text-[11px] uppercase tracking-widest hover:bg-[#7f5539] transition-all shadow-md active:scale-95"
          >
            + Write New Entry
          </Link>
        </div>

        {/* Loading and Error States */}
        {loading && <div className="text-center py-24 italic opacity-40 text-xl animate-pulse">Consulting the records...</div>}
        {error && <div className="text-center py-24 text-red-800 italic">{error}</div>}
        {!loading && articles.length === 0 && (
          <div className="text-center py-24 opacity-20 text-3xl italic">The journal remains blank for now.</div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {articles.map((post) => (
            <div 
              key={post.id} 
              className="group bg-white rounded-2xl border border-[#ede0d4] shadow-sm overflow-visible flex flex-col h-[560px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative"
            >
              {/* Card Header: Category & "Ink Stamp" Tags */}
              <div className="h-48 bg-[#f3e9dc] relative flex flex-col items-center justify-center p-6 text-center border-b border-[#fdfaf5] rounded-t-2xl">
                <span className="text-[14rem] font-bold text-[#99582a] opacity-[0.03] absolute select-none pointer-events-none">
                  {post.title[0]}
                </span>
                
                <div className="z-10">
                  <p className="text-[9px] uppercase tracking-[0.5em] text-[#b08968] mb-4">{post.category}</p>
                  <h4 className="text-xl font-bold text-[#7f5539] leading-tight px-2 line-clamp-2 mb-4">{post.title}</h4>
                  
                  {/* AI Bibliographic Tags */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {post.ai_tags?.split(',').map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-[8px] px-2 py-0.5 border border-[#99582a] text-[#99582a] rounded-sm uppercase tracking-tighter opacity-60 font-mono"
                        style={{ transform: `rotate(${idx % 2 === 0 ? -3 : 3}deg)` }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Archivist's Note (Sticky Note) - Visible on larger screens */}
              {post.archivist_note && (
                <div className="absolute -right-6 top-1/3 w-40 bg-[#fefce8] p-4 shadow-xl border-l-4 border-[#facc15] transform rotate-3 hidden xl:block group-hover:translate-x-2 transition-transform duration-500 z-20">
                  <p className="text-[8px] uppercase tracking-widest text-[#854d0e] font-bold mb-2 border-b border-[#fef08a] pb-1">
                    Archivist's Note
                  </p>
                  <p className="text-[10px] text-[#a16207] italic leading-relaxed">
                    "{post.archivist_note}"
                  </p>
                </div>
              )}

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow relative">
                <div className="absolute left-0 top-10 bottom-10 w-1 bg-[#99582a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] text-[#b08968] uppercase tracking-[0.2em] font-bold">
                    {formatDate(post.created_at)}
                  </p>
                  
                  {/* Author-only Delete Option */}
                  {String(currentUserId) === String(post.author_id) && (
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="text-[#99582a] opacity-30 hover:opacity-100 text-[10px] uppercase transition-opacity"
                    >
                      [ Strike ]
                    </button>
                  )}
                </div>
                
                <p className="text-[15px] leading-relaxed text-[#7f5539] italic line-clamp-6 mb-8">
                  "{post.content}"
                </p>
                
                {/* Footer Interaction */}
                <div className="mt-auto pt-6 border-t border-[#fdfaf5] flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[#b08968] lowercase italic text-[9px] mb-1 leading-none">Archived by</span>
                    <span className="text-[#432818] font-bold uppercase tracking-widest text-[10px]">{post.author_name}</span>
                  </div>

                  <div className="flex items-center gap-5">
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
                    <button className="text-[#99582a] text-[10px] font-bold uppercase tracking-tighter hover:underline">Read More</button>
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