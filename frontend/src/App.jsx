import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Login route placeholder</div>} />
        <Route path="/register" element={<div>Register route works</div>} />
      </Routes>
    </Router>
  );
}
