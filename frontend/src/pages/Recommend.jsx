import { useState } from "react";
import { getRecommendations } from "../services/api";

function Recommend() {
  const [text, setText] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access"); // JWT token

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:8000/api/recommend/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        context,
      }),
    });

    const data = await res.json();
    console.log("Backend response:", data); // 🔥 MUST appear
    setResults(data.recommendations || []);
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Backend connection failed.");
  } finally {
    setLoading(false);
  }
};


  

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Book Recommendation</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your mood or what you want to read..."
          rows={4}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit">Recommend</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {recommendations.map((book, index) => (
          <li key={index}>
            <strong>{book.title}</strong> — {book.author}
            <p>{book.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommend;

