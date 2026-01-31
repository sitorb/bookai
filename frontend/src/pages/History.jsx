import { useEffect, useState } from "react";
import api from "../api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await api.get("history/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch {
        alert("You must be logged in.");
        window.location.href = "/login";
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🕘 Recommendation History</h1>
      <div className="space-y-4 max-w-xl">
        {history.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">Input:</p>
            <p className="mb-2">{item.input_text}</p>
            <p className="font-semibold">Recommendation:</p>
            <pre className="whitespace-pre-wrap">{item.recommendation}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
