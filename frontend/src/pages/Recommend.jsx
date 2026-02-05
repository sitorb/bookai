import { useState } from "react";

export default function Recommend() {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const getRecommendations = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch("http://127.0.0.1:8000/api/recommend/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Failed to fetch recommendations");
        return;
      }

      setRecommendations(data.recommendations || []);
      setError("");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">📚 Book Recommender</h1>

        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Describe what kind of book you want..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={getRecommendations}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Get Recommendations
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <ul className="mt-4 space-y-2">
          {recommendations.map((book, index) => (
            <li key={index} className="border p-2 rounded">
              <p className="font-semibold">{book.title}</p>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm">{book.reason}</p>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
