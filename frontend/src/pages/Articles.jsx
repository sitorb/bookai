import React from 'react';
import { Link } from 'react-router-dom';

const Articles = () => {
  // Sample data - in a full build, this would come from your Django API
  const blogPosts = [
    {
      id: 101,
      title: "The Magic of Fall Reading",
      author: "The Librarian",
      date: "Oct 12, 2025",
      excerpt: "Exploring why autumn is the perfect season for gothic literature and heavy hardcovers...",
      category: "Literary Theory"
    },
    {
      id: 102,
      title: "AI in the Archives",
      author: "Archivist Team",
      date: "Nov 05, 2025",
      excerpt: "How we process 2.3 million records to find your next favorite book...",
      category: "Technology"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with "Add Article" Action */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-[#ede0d4] pb-8 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-light mb-2 tracking-tight">
              Library <span className="italic text-[#99582a]">Journal</span>
            </h1>
            <p className="text-[#b08968] italic">Community musings and archival notes</p>
          </div>
          
          <Link 
            to="/articles/create"
            className="bg-[#99582a] text-[#fdfaf5] px-8 py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#7f5539] transition-all shadow-md"
          >
            + Write Entry
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="group bg-white rounded-xl border border-[#ede0d4] shadow-sm overflow-hidden flex flex-col h-[450px] transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {/* Dynamic Text Placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#f3e9dc] to-[#ede0d4] relative flex items-center justify-center p-6 text-center">
                <span className="text-9xl font-bold text-[#99582a] opacity-5 absolute select-none">
                  {post.title[0]}
                </span>
                <div className="z-10">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#b08968] mb-2">{post.category}</p>
                  <h4 className="text-lg font-bold text-[#7f5539] leading-tight px-4">{post.title}</h4>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-[10px] text-[#b08968] mb-3 uppercase tracking-widest">{post.date}</p>
                <p className="text-sm leading-relaxed text-[#7f5539] italic line-clamp-4 mb-4">
                  "{post.excerpt}"
                </p>
                
                <div className="mt-auto pt-4 border-t border-[#fdfaf5] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#99582a]">
                  <span>By {post.author}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Read More →</span>
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