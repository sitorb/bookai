import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("recommendations/analytics/");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard.");
      }
    };

    fetchStats();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Your Reading Dashboard</h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <StatCard label="Requests" value={stats.total_requests} />
        <StatCard label="Recommendations" value={stats.total_recommendations} />
        <StatCard label="Favorites" value={stats.total_favorites} />
      </div>

      <h3>Top Books</h3>
      {stats.top_books.map((book, i) => (
        <p key={i}>
          {book.title} — {book.author} ({book.count} times)
        </p>
      ))}

      <h3>Recent Requests</h3>
      {stats.recent_requests.map((req, i) => (
        <p key={i}>
          “{req.input_text}” — {new Date(req.created_at).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: "#f2f2f2",
        minWidth: 120,
        textAlign: "center",
      }}
    >
      <h4>{label}</h4>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
