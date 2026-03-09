import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages - Note: No .js or .jsx extensions in imports!
import Recommend from './pages/Recommend';
import Articles from './pages/Articles';
import CreateArticle from './pages/CreateArticle';
import Login from './pages/Login';
import Register from './pages/Register';
import Discovery from './pages/Discovery';
import Library from './pages/Library';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Toaster />
      <div className="min-h-screen bg-[#fdfaf5] flex flex-col">
        {/* Navbar is here, so it shows up everywhere */}
        <Navbar /> 
        
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/articles" element={<Articles />} />
            
            <Route path="/recommend" element={<PrivateRoute><Recommend /></PrivateRoute>} />
            <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/articles/create" element={<PrivateRoute><CreateArticle /></PrivateRoute>} />

            <Route path="/" element={<Navigate to="/recommend" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;