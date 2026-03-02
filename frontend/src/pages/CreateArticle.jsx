import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Literary Theory');
  const [excerpt, setExcerpt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd send this to your Django backend
      // await axios.post('http://127.0.0.1:8000/api/articles/', { title, category, excerpt });
      
      toast.success("Entry added to the Journal!");
      navigate('/articles');
    } catch (err) {
      toast.error("The ink ran dry. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl border border-[#ede0d4] shadow-sm">
        <h1 className="text-3xl font-light mb-8 tracking-tight text-[#99582a] italic">
          New Journal Entry
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#b08968] mb-2">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-[#ede0d4] py-2 focus:border-[#99582a] outline-none transition-colors text-lg"
              placeholder="The Art of the Archive..."
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#b08968] mb-2">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent border-b border-[#ede0d4] py-2 outline-none"
            >
              <option>Literary Theory</option>
              <option>Technology</option>
              <option>History</option>
              <option>Community Discovery</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#b08968] mb-2">Your Thoughts</label>
            <textarea 
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full h-40 border border-[#ede0d4] p-4 rounded-lg focus:border-[#99582a] outline-none resize-none italic text-[#7f5539]"
              placeholder="Write your musings here..."
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#7f5539] text-[#ede0d4] py-3 rounded-full uppercase text-xs tracking-widest hover:bg-[#99582a] transition-all shadow-md"
          >
            Publish to Archives
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;