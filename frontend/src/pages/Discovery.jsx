import React from 'react';

const Discovery = () => {
  const trendingMoods = ["Melancholy", "Adventurous", "Nostalgic", "Cosy", "Whimsical"];

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-20 px-6 font-serif text-[#432818]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-[11px] uppercase tracking-[0.6em] text-[#99582a] mb-6 font-bold">Atmosphere</h2>
        <h1 className="text-6xl font-light mb-16 tracking-tight">Collective <span className="italic">Whispers</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="bg-[#f4e4d4] p-12 rounded-[3.5rem] shadow-sm border border-[#e2cbb5]">
            <h3 className="text-2xl mb-8 italic text-[#7a5c43]">Trending Moods</h3>
            <div className="flex flex-wrap gap-4">
              {trendingMoods.map(mood => (
                <span key={mood} className="bg-white/60 px-6 py-3 rounded-full text-sm font-sans tracking-wide text-[#7a5c43] border border-[#7a5c43]/10">
                  {mood}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#e8ece0] p-12 rounded-[3.5rem] shadow-sm border border-[#d1d9c5] flex flex-col justify-center">
            <h3 className="text-2xl mb-6 italic text-[#5a6b47]">The Global Pulse</h3>
            <p className="text-[#5a6b47] leading-relaxed font-sans text-sm">
              Today, the world is seeking <span className="font-bold underline">Solace</span>. Our librarian has guided over 1,200 souls to their next chapter in the last 24 hours.
            </p>
          </div>
        </div>

        <div className="mt-32 opacity-20 italic max-w-lg mx-auto border-t border-[#ede0d4] pt-8">
          <p className="text-sm">“A library is a place where you can lose your self and find it again in the heart of another.”</p>
        </div>
      </div>
    </div>
  );
};

export default Discovery;