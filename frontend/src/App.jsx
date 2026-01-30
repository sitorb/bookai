import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Recommend from "./pages/Recommend";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";



export default function App() {
  const isAuthenticated = !!localStorage.getItem("access");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/recommend" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/recommend"
        element={
          isAuthenticated ? <Recommend /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/history"
        element={
          isAuthenticated ? <History /> : <Navigate to="/login" />
        }
    />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        }
    />


    </Routes>
  );
}
