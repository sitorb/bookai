import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return <h1 className="text-3xl font-bold">Home page works 🎉</h1>;
}

function Recommend() {
  return <h1 className="text-3xl font-bold">Recommend page works 📚</h1>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommend" element={<Recommend />} />
      </Routes>
    </Router>
  );
}
