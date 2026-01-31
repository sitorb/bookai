import { useState } from "react";
import api from "../services/api";

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
      const res = await api.post("recommend/", {
        text,
        context,
      });
      setResults(res.data.recommendations);
    } catch (err) {
      console.error("API error:", err);
      setError("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          📚 Book Recommendations
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Describe how you feel or what you want to read..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="feel">Mood</option>
            <option value="genre">Genre</option>
            <option value="topic">Topic</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Recommend"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {results.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">✨ Recommendations</h3>
            {results.map((book, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 bg-slate-50 shadow-sm"
              >
                <p className="font-bold">
                  {book.title} — {book.author}
                </p>
                <p className="text-sm mt-1">{book.reason}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Confidence: {book.confidence}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
