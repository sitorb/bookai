import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
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

import './App.css';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'font-serif shadow-xl border border-[#ede0d4]',
          style: { background: '#fdfaf5', color: '#432818' },
        }}
      />

      <div className="min-h-screen bg-[#fdfaf5] flex flex-col">
        {/* Здесь вызывается наш обновленный Navbar */}
        <Navbar />

        <ErrorBoundary>
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/articles" element={<Articles />} />

              <Route 
                path="/recommend" 
                element={<PrivateRoute><Recommend /></PrivateRoute>} 
              />
              <Route 
                path="/library" 
                element={<PrivateRoute><Library /></PrivateRoute>} 
              />
              <Route 
                path="/profile" 
                element={<PrivateRoute><Profile /></PrivateRoute>} 
              />
              <Route 
                path="/articles/create" 
                element={<PrivateRoute><CreateArticle /></PrivateRoute>} 
              />

              <Route path="/" element={<Navigate to="/recommend" replace />} />
              <Route path="*" element={<Navigate to="/recommend" replace />} />
            </Routes>
          </main>
        </ErrorBoundary>

        <footer className="py-10 text-center text-[#b08968] text-xs font-serif italic border-t border-[#ede0d4]">
          The Autumn Librarian — Powered by Gemini AI &copy; 2026
        </footer>
      </div>
    </Router>
  );
}

export default App;