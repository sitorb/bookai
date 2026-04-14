import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://127.0.0.1:8000/api/books';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/profile/stats/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        toast.error("Could not retrieve your records.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center italic opacity-40">Reviewing registry...</div>;

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-20 px-6 font-serif text-[#432818]">
      <div className="max-w-4xl mx-auto">
        
        {/* Main Profile Card */}
        <div className="bg-white border border-[#ede0d4] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Avatar & Identity */}
          <div className="bg-[#f3e9dc] p-12 flex flex-col items-center justify-center text-center border-r border-[#ede0d4] md:w-1/3">
            <div className="w-32 h-32 bg-[#99582a] rounded-full flex items-center justify-center text-white text-5xl font-light mb-6 shadow-lg border-4 border-white">
              {stats?.username[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-[#7f5539]">{stats?.username}</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#b08968] mt-2">Patron since {stats?.date_joined}</p>
          </div>

          {/* Right Side: Scholarship Stats */}
          <div className="p-12 flex-grow">
            <div className="mb-10 border-b border-[#fdfaf5] pb-6">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#b08968] mb-8">Scholarship Record</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div className="flex flex-col">
                  <span className="text-4xl font-light text-[#99582a] mb-1">{stats?.manuscripts_count}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#432818] opacity-60">Manuscripts</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-light text-[#99582a] mb-1">{stats?.nooks_count}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#432818] opacity-60">Nooks Curated</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-light text-[#99582a] mb-1">{stats?.total_impact}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#432818] opacity-60">Archival Impact</span>
                </div>
              </div>
            </div>

            {/* Achievement/Rank Logic */}
            <div className="bg-[#fdfaf5] p-6 rounded-xl border border-[#ede0d4] relative overflow-hidden">
               <div className="absolute right-[-20px] top-[-10px] text-8xl opacity-[0.03] rotate-12">📜</div>
               <h4 className="text-[10px] uppercase font-bold text-[#99582a] mb-2">Current Rank</h4>
               <p className="text-xl italic text-[#7f5539]">
                 {stats?.manuscripts_count > 10 ? "Senior Archivist" : stats?.manuscripts_count > 0 ? "Junior Scribe" : "Newly Registered Patron"}
               </p>
               <p className="text-[10px] text-[#b08968] mt-2">Maintain your research to reach the next tier.</p>
            </div>

            <div className="mt-12 flex gap-4">
               <button className="bg-[#432818] text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#2e1c11] transition-all">Edit Record</button>
               <button onClick={() => {localStorage.clear(); window.location.href='/login'}} className="border border-[#ede0d4] text-[#b08968] px-8 py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-800 hover:border-red-100 transition-all">Sign Out</button>
            </div>
          </div>
        </div>

        {/* Decorative Quote */}
        <p className="text-center mt-12 text-[#b08968] italic text-sm opacity-60">
          "The library is a growing organism." — S.R. Ranganathan
        </p>
      </div>
    </div>
  );
};

export default Profile;