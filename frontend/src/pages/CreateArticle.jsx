import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Literary Theory');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_BASE_URL = 'http://127.0.0.1:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token'); // Retrieve the JWT/Auth token
    
    try {
      // Sending the data to the Django endpoint we created
      await axios.post(`${API_BASE_URL}/api/articles/`, {
        title: title,
        category: category,
        content: content
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Crucial for identifying the user
          'Content-Type': 'application/json'
        }
      });

      toast.success("Entry added to the Journal archives.");
      navigate('/articles'); // Return to the journal list
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("The librarian couldn't archive your entry. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-16 px-4 font-serif text-[#432818]">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumb / Back Link */}
        <Link to="/articles" className="text-[10px] uppercase tracking-[0.2em] text-[#b08968] hover:text-[#99582a] transition-colors mb-8 inline-block">
          ← Back to Journal
        </Link>

        <div className="bg-white p-10 md:p-16 rounded-2xl border border-[#ede0d4] shadow-sm relative overflow-hidden">
          {/* Decorative Corner Accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f3e9dc] rounded-bl-full opacity-50 -mr-12 -mt-12" />

          <div className="relative z-10">
            <h1 className="text-4xl font-light mb-2 tracking-tight">
              Pen a <span className="italic text-[#99582a]">New Entry</span>
            </h1>
            <p className="text-sm text-[#7f5539] mb-10 opacity-70">Contribute your musings to the Autumn Librarian archives.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Input */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#b08968] mb-3">Article Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-[#ede0d4] py-3 text-2xl outline-none focus:border-[#99582a] transition-all placeholder:text-[#ede0d4] font-bold"
                  placeholder="The Whispers of the Old Library..."
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#b08968] mb-3">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#fdfaf5] border border-[#ede0d4] p-3 rounded-lg outline-none focus:ring-1 focus:ring-[#99582a] text-sm"
                  >
                    <option>Literary Theory</option>
                    <option>Technology</option>
                    <option>History</option>
                    <option>Community Discovery</option>
                  </select>
                </div>
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#b08968] mb-3">Your Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-64 bg-[#fdfaf5] border border-[#ede0d4] p-6 rounded-xl outline-none focus:ring-1 focus:ring-[#99582a] transition-all italic text-[#7f5539] leading-relaxed resize-none"
                  placeholder="In the quietest corner of the archives, I found a volume that changed my perspective..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 flex justify-center">
                <button 
                  type="submit"
                  disabled={loading}
                  className={`bg-[#7f5539] text-[#ede0d4] px-12 py-4 rounded-full uppercase text-xs tracking-widest shadow-lg transition-all
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#99582a] hover:-translate-y-1 active:scale-95'}`}
                >
                  {loading ? "Sealing the Envelope..." : "Publish to Journal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;