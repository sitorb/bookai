import React, { useState } from 'react';
import { api } from '../services/api';

const DiscoveryHall = () => {
    const [oracleBook, setOracleBook] = useState(null);
    const [loading, setLoading] = useState(false);

    const consultOracle = async () => {
        setLoading(true);
        try {
            const response = await api.getRandomBook();
            setOracleBook(response.data);
        } catch (err) {
            console.error("The Oracle is faint...", err);
            alert("The Librarian is busy dusting. Try again in a moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="discovery-container">
            <h1>Discovery <i>Hall</i></h1>
            <button onClick={consultOracle} className="oracle-btn">
                {loading ? "Chanting..." : "CONSULT ORACLE 🔮"}
            </button>

            {oracleBook && (
                <div className="oracle-result card-vintage">
                    <h3>{oracleBook.title}</h3>
                    <p>By {oracleBook.author}</p>
                    <small>{oracleBook.summary}</small>
                </div>
            )}
        </div>
    );
};

export default DiscoveryHall;