import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("recommendations/")
      .then(res => setData(res.data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div>
      <h1>BookAI Frontend</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;


export default App
