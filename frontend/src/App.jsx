import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Recommend from "./pages/Recommend";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/recommend" />} />
      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
      <Route
        path="/recommend"
        element={
          isAuthenticated ? <Recommend /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}
