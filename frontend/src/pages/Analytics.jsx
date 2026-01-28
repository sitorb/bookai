import { useEffect, useState } from "react";
import api from "../services/api";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("recommendations/analytics/").then(res => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Analytics</h2>

      <p>Total Requests: {data.total_requests}</p>
      <p>Total Recommendations: {data.total_recommendations}</p>
      <p>Total Favorites: {data.total_favorites}</p>

      <h3>Top Books</h3>
      {data.top_books.map((book, i) => (
        <p key={i}>{book.title} — {book.author} ({book.count})</p>
      ))}

      <h3>Recent Requests</h3>
      {data.recent_requests.map((req, i) => (
        <p key={i}>{req.input_text} — {req.created_at}</p>
      ))}
    </div>
  );
}
