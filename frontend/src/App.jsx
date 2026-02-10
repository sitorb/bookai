import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Ensure this line is correct
import Navbar from './components/Navbar';
import Recommend from './pages/Recommend';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Set a default home path or redirect to recommend */}
        <Route path="/" element={<Recommend />} /> 
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/library" element={<Library />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;