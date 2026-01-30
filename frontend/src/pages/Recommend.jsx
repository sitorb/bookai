import { useState } from "react";
import api from "../services/api";

export default function Recommend() {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Form submitted. Text:", text);

    try {
      const res = await api.post("recommend/", { text });
      console.log("Backend response:", res.data);
      setResults(res.data.recommendations || []);
    } catch (err) {
      console.error("API error:", err);
      setError("Backend connection failed.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Get Book Recommendations</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe how you feel..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
        />
        <br />
        <button type="submit">Recommend</button>
        <button onClick={() => saveFavorite(book)}>❤️ Save</button>

      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.map((book, i) => (
        <div key={i}>
          <strong>{book.title}</strong> — {book.author}
          <p>{book.reason}</p>
        </div>
      ))}
    </div>
  );
}

const saveFavorite = async (book) => {
  try {
    await api.post("library/favorites/", { book_id: book.id });
    alert("Saved to favorites!");
  } catch {
    alert("Failed to save.");
  }
};
