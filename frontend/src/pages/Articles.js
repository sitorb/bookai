import React from 'react';

const Articles = () => {
  const blogPosts = [
    { title: "The Magic of Fall Reading", date: "Oct 12, 2025", excerpt: "Why autumn is the perfect season for gothic literature..." },
    { title: "Understanding AI in Libraries", date: "Nov 05, 2025", excerpt: "How we indexed 2.3 million books for this project..." },
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-12 border-b border-[#ede0d4] pb-4 tracking-tight">
          Library <span className="italic text-[#99582a]">Journal</span>
        </h1>
        <div className="space-y-12">
          {blogPosts.map((post, i) => (
            <article key={i} className="group cursor-pointer">
              <p className="text-[10px] uppercase tracking-widest text-[#b08968] mb-2">{post.date}</p>
              <h2 className="text-2xl font-bold group-hover:text-[#99582a] transition-colors mb-3">{post.title}</h2>
              <p className="text-[#7f5539] leading-relaxed italic">"{post.excerpt}"</p>
              <div className="mt-4 w-10 h-0.5 bg-[#99582a] group-hover:w-20 transition-all"></div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;