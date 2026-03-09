import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar'; // Тот самый, который мы исправили выше
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Recommend from './pages/Recommend';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Discovery from './pages/Discovery';
import Articles from './pages/Articles';
import CreateArticle from './pages/CreateArticle';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-[#fdfaf5] flex flex-col">
        
        {/* Navbar теперь внутри Router, поэтому Link и useNavigate будут работать */}
        <Navbar />

        <ErrorBoundary>
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
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;