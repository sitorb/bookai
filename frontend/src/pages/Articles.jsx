import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [userCollections, setUserCollections] = useState([]); // For the Reading Nook feature
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const currentUserId = localStorage.getItem('user_id'); 
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // 1. Fetch Articles & User Collections
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        // Fetch articles
        const artResponse = await axios.get(`${API_BASE_URL}/api/articles/`, { headers });
        setArticles(artResponse.data);

        // Fetch user's "Nooks" (Collections) if logged in
        if (token) {
          const collResponse = await axios.get(`${API_BASE_URL}/api/collections/`, { headers });
          setUserCollections(collResponse.data);
        }
      } catch (err) {
        setError("The archive stacks are currently inaccessible.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Heart/Like Logic
  const handleLike = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Log in to heart this entry.");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/articles/${id}/like/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(prev => prev.map(a => a.id === id ? { ...a, likes_count: res.data.count, is_liked: res.data.liked } : a));
      if (res.data.liked) toast("Favorited", { icon: '❤️' });
    } catch (err) { toast.error("Ink failed to bond."); }
  };

  // 3. Delete Logic
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm("Strike this entry from the record?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/articles/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(prev => prev.filter(a => a.id !== id));
      toast.success("Entry removed.");
    } catch (err) { toast.error("Unauthorized removal attempt."); }
  };

  // 4. Reading Nook (Collection) Toggle
  const handleAddToNook = async (collectionId, articleId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/collections/${collectionId}/toggle_article/`, 
        { article_id: articleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.status === 'added' ? "Tucked into your Nook" : "Removed from Nook", { icon: '🔖' });
    } catch (err) { toast.error("Could not reach the shelf."); }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-6 font-serif text-[#432818]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-[#ede0d4] pb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-light mb-3 tracking-tight">Library <span className="italic text-[#99582a]">Journal</span></h1>
            <p className="text-[#b08968] italic opacity-80">Community records and librarian annotations</p>
          </div>
          <Link to="/articles/create" className="bg-[#99582a] text-[#fdfaf5] px-10 py-3 rounded-full text-[11px] uppercase tracking-widest hover:bg-[#7f5539] transition-all shadow-md active:scale-95">+ Write Entry</Link>
        </div>

        {loading && <div className="text-center py-24 italic opacity-40 animate-pulse">Scanning the archives...</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
          {articles.map((post) => (
            <div key={post.id} className="group bg-white rounded-2xl border border-[#ede0d4] shadow-sm overflow-visible flex flex-col h-[580px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative">
              
              {/* Card Header: Category & Stamps */}
              <div className="h-48 bg-[#f3e9dc] relative flex flex-col items-center justify-center p-6 text-center border-b border-[#fdfaf5] rounded-t-2xl">
                <span className="text-[14rem] font-bold text-[#99582a] opacity-[0.03] absolute select-none pointer-events-none">{post.title[0]}</span>
                <div className="z-10">
                  <p className="text-[9px] uppercase tracking-[0.5em] text-[#b08968] mb-3">{post.category}</p>
                  <h4 className="text-xl font-bold text-[#7f5539] leading-tight mb-4">{post.title}</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {post.ai_tags?.split(',').map((tag, idx) => (
                      <span key={idx} className="text-[8px] px-2 py-0.5 border border-[#99582a] text-[#99582a] rounded-sm uppercase font-mono" style={{ transform: `rotate(${idx % 2 === 0 ? -3 : 3}deg)` }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Archivist's Sticky Note */}
              {post.archivist_note && (
                <div className="absolute -right-8 top-1/4 w-44 bg-[#fefce8] p-4 shadow-xl border-l-4 border-[#facc15] transform rotate-2 hidden xl:block group-hover:translate-x-2 transition-transform duration-500 z-20">
                  <p className="text-[8px] uppercase tracking-widest text-[#854d0e] font-bold mb-2 border-b border-[#fef08a] pb-1">Librarian's Note</p>
                  <p className="text-[10px] text-[#a16207] italic leading-relaxed">"{post.archivist_note}"</p>
                </div>
              )}

              {/* Body */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] text-[#b08968] uppercase font-bold">{formatDate(post.created_at)}</p>
                  {String(currentUserId) === String(post.author_id) && (
                    <button onClick={() => handleDelete(post.id)} className="text-[#99582a] opacity-30 hover:opacity-100 text-[10px] uppercase">[ Strike ]</button>
                  )}
                </div>
                <p className="text-[15px] leading-relaxed text-[#7f5538] italic line-clamp-6 mb-8">"{post.content}"</p>
                
                {/* Footer Interaction */}
                <div className="mt-auto pt-6 border-t border-[#fdfaf5] flex justify-between items-center relative">
                  <div className="flex flex-col">
                    <span className="text-[#b08968] italic text-[9px]">Archived by</span>
                    <span className="text-[#432818] font-bold uppercase tracking-widest text-[10px]">{post.author_name}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Heart Button */}
                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 group/heart">
                      <span className={`text-xl transition-all ${post.is_liked ? 'text-red-500' : 'text-stone-300'}`}>{post.is_liked ? '❤️' : '♡'}</span>
                      <span className="text-[11px] font-bold text-stone-400">{post.likes_count || 0}</span>
                    </button>

                    {/* Reading Nook Bookmark Dropdown */}
                    <div className="relative group/nook">
                      <button className="text-stone-300 hover:text-[#99582a] text-xl transition-colors">🔖</button>
                      <div className="absolute bottom-full right-0 mb-3 w-48 bg-white border border-[#ede0d4] shadow-2xl rounded-xl py-3 hidden group-hover/nook:block z-50 animate-in fade-in slide-in-from-bottom-2">
                        <p className="px-4 py-1 text-[8px] uppercase tracking-widest text-[#b08968] border-b border-[#fdfaf5] mb-2 font-bold">Save to Nook:</p>
                        {userCollections.length > 0 ? (
                          userCollections.map(nook => (
                            <button key={nook.id} onClick={() => handleAddToNook(nook.id, post.id)} className="w-full text-left px-4 py-2 text-[10px] text-[#432818] hover:bg-[#fdfaf5] hover:text-[#99582a] transition-colors flex justify-between items-center">
                              {nook.name} <span className="opacity-0 group-hover:opacity-100">+</span>
                            </button>
                          ))
                        ) : (
                          <Link to="/profile" className="block px-4 py-2 text-[9px] italic text-stone-400">Create a Nook in Profile...</Link>
                        )}
                      </div>
                    </div>
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