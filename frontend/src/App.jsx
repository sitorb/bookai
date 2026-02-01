import { useState } from "react";
import { Link } from "react-router-dom";


export default function App() {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/recommend/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ text }),
      });
      

      const data = await res.json();
      setResults(data.recommendations || []);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">📚 Book Recommender</h1>

        <textarea
          className="w-full border rounded p-3 mb-4"
          rows="4"
          placeholder="Describe what kind of book you want..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Get Recommendations"}
        </button>

        <div className="flex gap-4 mb-4">
          <Link to="/recommend" className="underline">Recommend</Link>
          <Link to="/history" className="underline">History</Link>
        </div>


        <div className="mt-6 space-y-3">
          {results.map((book, i) => (
            <div key={i} className="border p-3 rounded">
              <p className="font-semibold">{book.title}</p>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-500">
                Confidence: {book.confidence}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
