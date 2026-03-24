import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const MyNooks = () => {
    const [nooks, setNooks] = useState([]);
    const [newNookName, setNewNookName] = useState("");

    useEffect(() => {
        loadNooks();
    }, []);

    const loadNooks = async () => {
        const res = await api.getNooks();
        setNooks(res.data);
    };

    const handleCreateNook = async (e) => {
        e.preventDefault();
        await api.createNook(newNookName);
        setNewNookName("");
        loadNooks();
    };

    return (
        <div className="nooks-page">
            <h2>Your Private <i>Nooks</i></h2>
            
            <form onSubmit={handleCreateNook}>
                <input 
                    value={newNookName} 
                    onChange={(e) => setNewNookName(e.target.value)}
                    placeholder="Name your new shelf (e.g. Forbidden Spells)"
                />
                <button type="submit">Build Shelf</button>
            </form>

            <div className="nooks-grid">
                {nooks.map(nook => (
                    <div key={nook.id} className="nook-card">
                        <h3>{nook.name}</h3>
                        <p>{nook.articles.length} volumes collected</p>
                        <ul>
                            {nook.articles.map(art => (
                                <li key={art.id}>{art.title}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyNooks;