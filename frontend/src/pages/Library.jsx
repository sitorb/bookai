import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Library = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNookName, setNewNookName] = useState("");

  const API_BASE_URL = 'http://127.0.0.1:8000/api/books';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/nooks/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setCollections(res.data);
    } catch (err) {
      toast.error("The private archives are locked.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNook = async (e) => {
    e.preventDefault();
    if (!newNookName) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/nooks/`,
        { name: newNookName },
        { headers: { Authorization: `Token ${token}` } }
      );
      setCollections([...collections, res.data]);
      setNewNookName("");
      setShowCreateModal(false);
      toast.success(`'${newNookName}' shelf added.`);
    } catch (err) {
      toast.error("Could not build the shelf.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] py-16 px-8 font-serif text-[#432818]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-[#ede0d4] pb-8 gap-4">
          <div>
            <h1 className="text-4xl font-light mb-2">Personal <span className="italic text-[#99582a]">Sanctuary</span></h1>
            <p className="text-[#b08968] italic">Your curated collections and private readings.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="border border-[#99582a] text-[#99582a] px-6 py-2 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#99582a] hover:text-white transition-all"
          >
            + New Reading Nook
          </button>
        </div>

        {loading && <div className="text-center py-20 italic opacity-40">Opening the study hall doors...</div>}

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((nook) => (
            <div key={nook.id} className="group relative bg-white border border-[#ede0d4] p-8 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center">
              {/* Folder/Book Aesthetic Icon */}
              <div className="w-20 h-24 bg-[#f3e9dc] mb-6 rounded-r-md border-l-4 border-[#99582a] relative flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3">
                <span className="text-2xl opacity-40">🔖</span>
              </div>
              
              <h3 className="text-xl font-bold text-[#7f5539] mb-2">{nook.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#b08968] mb-6">
                {nook.articles?.length || 0} Volumes Saved
              </p>

              <Link 
                to={`/library/nook/${nook.id}`}
                className="mt-auto text-[10px] font-bold uppercase tracking-tighter text-[#99582a] border-b border-transparent hover:border-[#99582a] transition-all"
              >
                Enter Nook →
              </Link>

              {/* Decorative "Inventory Number" */}
              <span className="absolute top-4 right-4 font-mono text-[8px] opacity-20">NOOK-00{nook.id}</span>
            </div>
          ))}

          {/* Empty State */}
          {!loading && collections.length === 0 && (
            <div className="col-span-full text-center py-20 bg-stone-50 rounded-lg border-2 border-dashed border-[#ede0d4]">
              <p className="italic text-[#b08968]">Your shelves are currently empty. Start by creating a new nook.</p>
            </div>
          )}
        </div>
      </div>

      {/* Simple "New Nook" Modal Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#432818]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full border border-[#ede0d4]">
            <h2 className="text-2xl mb-6 font-light">Name your <span className="italic text-[#99582a]">Reading Nook</span></h2>
            <form onSubmit={handleCreateNook}>
              <input 
                type="text" 
                placeholder="e.g., Victorian Mysteries..."
                className="w-full bg-[#fdfaf5] border-b-2 border-[#ede0d4] py-3 px-2 mb-8 focus:outline-none focus:border-[#99582a] transition-colors font-serif italic"
                value={newNookName}
                onChange={(e) => setNewNookName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="text-[10px] uppercase tracking-widest text-stone-400">Cancel</button>
                <button type="submit" className="bg-[#99582a] text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#7f5539] transition-all">Build Shelf</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;