import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/history/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

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
