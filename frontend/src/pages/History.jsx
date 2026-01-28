import { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("recommendations/history/").then(res => {
      setHistory(res.data.history);
    });
  }, []);

  return (
    <div>
      <h2>My Recommendation History</h2>
      {history.map((item, i) => (
        <div key={i}>
          <h3>{item.title}</h3>
          <p>{item.author}</p>
          <p>{item.reason}</p>
          <p>{item.context}</p>
          <small>{item.created_at}</small>
        </div>
      ))}
    </div>
  );
}
