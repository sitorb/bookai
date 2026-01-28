import { Routes, Route } from "react-router-dom";
import Recommend from "./pages/Recommend";

function App() {
  return (
    <Routes>
      <Route path="/recommend" element={<Recommend />} />
      <Route path="*" element={<h2>Page not found</h2>} />
    </Routes>
  );
}

export default App;
