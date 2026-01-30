import { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("recommendations/history/");
        setHistory(res.data.history || res.data);
      } catch (err) {
        setError("Failed to load history.");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2>Your Recommendation History</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {history.length === 0 && <p>No history yet.</p>}

      {history.map((rec, i) => (
        <div key={i} style={{ borderBottom: "1px solid #ccc", marginBottom: 12 }}>
          <strong>{rec.title}</strong> — {rec.author}
          <p>{rec.reason}</p>
          <small>{new Date(rec.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
