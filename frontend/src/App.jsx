import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<div>Register route works</div>} />
        <Route path="/recommend" element={<div>Recommend works</div>} />
      </Routes>
    </Router>
  );
}
