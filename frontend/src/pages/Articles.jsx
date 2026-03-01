import React from 'react';

const Articles = () => {
  // Sample data for your journal entries
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
      title: "How AI Reads 2.3 Million Books",
      author: "Archivist Team",
      date: "Nov 05, 2025",
      excerpt: "A deep dive into the vector embeddings and cosine similarity behind our recommendation engine...",
      category: "Technology"
    },
    {
      id: 103,
      title: "Forgotten Classics of the 19th Century",
      author: "Historian",
      date: "Dec 01, 2025",
      excerpt: "Rediscovering the works that time forgot, now indexed in our digital archives...",
      category: "History"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-12 px-4 font-serif text-[#432818]">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 tracking-tight">
            Library <span className="italic text-[#99582a]">Journal</span>
          </h1>
          <p className="text-[#7f5539] italic opacity-70">Musings from the deep archives</p>
        </div>

        {/* Articles Grid (Table Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="group bg-white rounded-xl border border-[#ede0d4] shadow-sm overflow-hidden flex flex-col h-[480px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              {/* Dynamic Article Placeholder (No image needed) */}
              <div className="h-56 bg-[#f3e9dc] relative overflow-hidden flex items-center justify-center border-b border-[#ede0d4]">
                <div className="flex flex-col items-center justify-center p-8 text-center h-full w-full bg-gradient-to-br from-[#ede0d4] to-[#f3e9dc]">
                  <span className="text-8xl font-bold text-[#99582a] opacity-10 absolute top-4 left-4 select-none">
                    {post.title[0]}
                  </span>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#b08968] mb-4 z-10">
                    {post.category}
                  </p>
                  <h4 className="text-xl font-bold text-[#7f5539] leading-tight z-10">
                    {post.title}
                  </h4>
                  <div className="w-12 h-0.5 bg-[#99582a] opacity-30 my-4"></div>
                  <p className="text-[10px] italic text-[#b08968] z-10">
                    Issue No. {post.id}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>

              {/* Details Area */}
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#99582a] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#b08968] mb-1">
                    {post.date}
                  </p>
                  <h3 className="text-lg font-bold text-[#432818] line-clamp-2">
                    {post.title}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-[#7f5539] line-clamp-3 italic mb-4">
                  "{post.excerpt}"
                </p>

                <div className="mt-auto pt-4 border-t border-[#fdfaf5] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#99582a]">
                  <span>By {post.author}</span>
                  <span className="group-hover:translate-x-1 transition-transform">Read Entry →</span>
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