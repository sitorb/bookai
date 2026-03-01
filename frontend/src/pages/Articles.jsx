import React from 'react';

const Articles = () => {
  const blogPosts = [
    { 
      id: 1, 
      title: "The Magic of Fall Reading", 
      date: "Oct 12, 2025", 
      excerpt: "Exploring why autumn is the perfect season for gothic literature..." 
    },
    { 
      id: 2, 
      title: "How AI Reads 2.3 Million Books", 
      date: "Nov 05, 2025", 
      excerpt: "A deep dive into the technology behind our recommendations..." 
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-light mb-12 border-b border-[#ede0d4] pb-6 tracking-tight text-center">
          Library <span className="italic text-[#99582a]">Journal</span>
        </h1>

        <div className="space-y-16">
          {blogPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#b08968] mb-3">{post.date}</p>
              <h2 className="text-3xl font-bold group-hover:text-[#99582a] transition-all mb-4">
                {post.title}
              </h2>
              <p className="text-lg text-[#7f5539] leading-relaxed italic opacity-80">
                "{post.excerpt}"
              </p>
              <div className="mt-6 w-12 h-0.5 bg-[#99582a] group-hover:w-24 transition-all duration-500"></div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;