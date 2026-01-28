import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Recommend from "./pages/Recommend";
import History from "./pages/History";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
