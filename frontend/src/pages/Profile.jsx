import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [data, setData] = useState({
    username: "Autumn Voyager",
    bio: "Searching for stories that feel like crisp leaves and warm tea.",
    volumes: 5000,
    taste_score: "98% Gold",
    dna: "Autumn Soul",
    history: []
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users/analytics/')
      .then(res => setData(prev => ({ ...prev, ...res.data })))
      .catch(() => console.log("Using local parchment data"));
  }, []);

  const stats = [
    { label: "Collection", value: `${data.volumes} Volumes`, color: "bg-[#f4e4d4]" },
    { label: "Taste Score", value: data.taste_score, color: "bg-[#e8ece0]" },
    { label: "Reader DNA", value: data.dna, color: "bg-[#faedcd]" }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-16 px-4 font-serif text-[#432818]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-28 h-28 bg-[#7f5539] rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-[#fdfaf5] shadow-2xl border-4 border-[#ede0d4]">
            {data.username[0]}
          </div>
          <h2 className="text-4xl font-light mb-3 tracking-tight">{data.username}</h2>
          <p className="text-[#9c6644] italic px-12 leading-relaxed">“{data.bio}”</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.color} p-10 rounded-[2rem] text-center border border-[#ddb892]/20 shadow-sm transition-all hover:shadow-md`}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#7f5539] mb-3 font-bold opacity-70">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-[3rem] p-12 border border-[#ede0d4] shadow-inner">
          <h3 className="text-xl text-[#7f5539] mb-8 border-b border-[#f4e4d4] pb-6 flex justify-between items-center italic">
            <span>Recent Chronologies</span>
            <span className="text-[10px] uppercase tracking-widest opacity-40 font-sans font-bold">Archives</span>
          </h3>
          
          <div className="py-12 text-center">
            <div className="text-5xl mb-6 opacity-10 italic">📖</div>
            <p className="text-[#b08968] italic font-light">Your literary journey is being transcribed into the permanent record...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;