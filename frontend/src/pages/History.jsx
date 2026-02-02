import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/api/history/")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setHistory)
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Your Recommendation History</h1>

      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">Input:</p>
            <p className="mb-2">{item.input_text}</p>

            <p className="font-semibold">Recommendations:</p>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(item.recommendations, null, 2)}
            </pre>

            <p className="text-xs text-gray-500 mt-2">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
