import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 1. Import Layout & Logic Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

// 2. Import Pages
import Recommend from './pages/Recommend';
import Library from './pages/Library';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Discovery from './pages/Discovery';
import Articles from './pages/Articles';
import CreateArticle from './pages/CreateArticle'; // Ensure this file exists as .jsx

// 3. Global Styles
import './App.css';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'font-serif shadow-xl border border-stone-100',
          style: { background: '#ffffff', color: '#1c1917' },
        }}
      />

      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />

        <ErrorBoundary>
          <main className="flex-grow">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/articles" element={<Articles />} />

              {/* --- Protected Routes --- */}
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
              {/* New: Route for users to add articles */}
              <Route 
                path="/articles/create" 
                element={<PrivateRoute><CreateArticle /></PrivateRoute>} 
              />

              {/* --- Redirections --- */}
              <Route path="/" element={<Navigate to="/recommend" replace />} />
              <Route path="*" element={<Navigate to="/recommend" replace />} />
            </Routes>
          </main>
        </ErrorBoundary>

        <footer className="py-6 text-center text-stone-400 text-sm font-serif italic border-t border-stone-200">
          Powered by AI Librarian &copy; 2026
        </footer>
      </div>
    </Router>
  );
}

export default App;