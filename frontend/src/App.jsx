import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from "react";

function App() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/recommendations/analytics/")
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📚 BookAI Dashboard</h1>
      {!analytics ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Total Requests: {analytics.total_requests}</p>
          <p>Total Recommendations: {analytics.total_recommendations}</p>
          <p>Total Favorites: {analytics.total_favorites}</p>
        </>
      )}
    </div>
  );
}

export default App;
