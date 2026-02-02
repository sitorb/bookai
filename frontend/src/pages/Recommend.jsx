import { useState } from "react";
import { getRecommendations } from "../services/api";


export default function Recommend() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access");
    try {
      const data = await getRecommendations(text, token);
      setResult(data);
    } catch {
      alert("You must be logged in.");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🔮 Get Recommendations</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <textarea
          className="w-full p-3 border rounded"
          rows="4"
          placeholder="Describe what kind of book you're in the mood for..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          {loading ? "Thinking..." : "Recommend"}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-xl">
          <h2 className="text-xl font-bold mb-2">📖 Recommendation</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
