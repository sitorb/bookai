import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const NookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nook, setNook] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://127.0.0.1:8000/api/books';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNookContent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/nooks/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setNook(res.data);
      } catch (err) {
        toast.error("This shelf appears to be missing from the records.");
        navigate('/library');
      } finally {
        setLoading(false);
      }
    };
    fetchNookContent();
  }, [id, token, navigate]);

  const handleRemoveFromNook = async (articleId) => {
    try {
      await axios.post(`${API_BASE_URL}/nooks/${id}/toggle_article/`,
        { article_id: articleId },
        { headers: { Authorization: `Token ${token}` } }
      );
      // Update local state to remove the item instantly
      setNook({
        ...nook,
        articles: nook.articles.filter(art => art.id !== articleId)
      });
      toast.success("Entry returned to the general stacks.");
    } catch (err) {
      toast.error("The item is stuck to the shelf.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center font-serif italic text-[#b08968]">
      Scanning the shelf...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-16 px-8 font-serif text-[#432818]">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-12">
          <Link to="/library" className="text-[10px] uppercase tracking-widest text-[#99582a] hover:underline mb-6 inline-block">
            ← Return to Sanctuary
          </Link>
          <div className="flex justify-between items-end border-b-2 border-[#ede0d4] pb-6">
            <div>
              <h1 className="text-4xl font-light">{nook?.name}</h1>
              <p className="text-[#b08968] italic mt-1">A curated selection of {nook?.articles?.length} volumes.</p>
            </div>
            <span className="font-mono text-[10px] opacity-30 mb-2">SHELF-ID: {id}</span>
          </div>
        </div>

        {/* Articles in Nook */}
        <div className="space-y-8">
          {nook?.articles?.length > 0 ? (
            nook.articles.map((article) => (
              <div 
                key={article.id} 
                className="group bg-white border border-[#ede0d4] p-8 rounded-sm shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8 relative"
              >
                {/* Decorative Side Tab */}
                <div className="w-1 bg-[#99582a] absolute left-0 top-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] uppercase tracking-widest text-[#b08968] font-bold">
                      {article.category}
                    </span>
                    <button 
                      onClick={() => handleRemoveFromNook(article.id)}
                      className="text-[9px] uppercase tracking-tighter text-[#99582a] opacity-40 hover:opacity-100 transition-opacity"
                    >
                      [ Un-shelf ]
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#7f5539] mb-4 group-hover:text-[#99582a] transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-[#432818] leading-relaxed italic line-clamp-3 mb-6 opacity-80">
                    "{article.content}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-stone-400">
                    <span>By {article.author_name}</span>
                    <Link to={`/articles`} className="text-[#99582a] hover:underline">View Full Entry</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-lg border-2 border-dashed border-[#ede0d4]">
              <p className="italic text-[#b08968]">This nook is currently silent. Go to the Journal to find entries to shelf here.</p>
              <Link to="/articles" className="mt-4 inline-block text-[10px] uppercase tracking-widest bg-[#99582a] text-white px-8 py-3 rounded-full hover:bg-[#7f5539] transition-all">
                Browse Journal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NookDetail;