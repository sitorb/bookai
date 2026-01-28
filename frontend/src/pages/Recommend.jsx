import { useState } from "react";
import { getRecommendations } from "../services/api";

export default function Recommend() {
  const [text, setText] = useState("");
  const [context, setContext] = useState("feel");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access");
      const data = await getRecommendations(text, context, token);
      console.log("Backend response:", data);
      setResults(data.recommendations || []);
    } catch (err) {
      console.error("API error:", err);
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Get Book Recommendations</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe how you feel or what you want to read..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
        />

        <select value={context} onChange={(e) => setContext(e.target.value)}>
          <option value="feel">Mood</option>
          <option value="genre">Genre</option>
          <option value="topic">Topic</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Recommend"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <div>
          <h3>Recommendations</h3>
          {results.map((book, i) => (
            <div key={i} style={{ borderBottom: "1px solid #ccc", marginBottom: 12 }}>
              <strong>{book.title}</strong> — {book.author}
              <p>{book.reason}</p>
              <small>Confidence: {book.confidence}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
