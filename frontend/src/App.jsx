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

// 3. Global Styles (Optional but recommended)
import './App.css';

function App() {
  return (
    <Router>
      {/* Global Notifications: Fixes the Vite resolution error */}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          className: 'font-serif shadow-xl border border-stone-100',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1c1917',
          },
        }}
      />

      <div className="min-h-screen bg-stone-50 flex flex-col">
        {/* Navigation bar is always visible */}
        <Navbar />

        {/* Safety Net: Catches crashes in any of the pages below */}
        <ErrorBoundary>
          <main className="flex-grow">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* --- Protected Routes (Require Token) --- */}
              {/* These guards prevent "reading properties of null" errors */}
              <Route 
                path="/recommend" 
                element={
                  <PrivateRoute>
                    <Recommend />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/library" 
                element={
                  <PrivateRoute>
                    <Library />
                  </PrivateRoute>
                } 
              />

              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />

              {/* --- Logic Routes --- */}
              {/* Default landing page */}
              <Route path="/" element={<Navigate to="/recommend" replace />} />
              
              {/* 404 Redirect to home */}
              <Route path="*" element={<Navigate to="/recommend" replace />} />
            </Routes>
          </main>
        </ErrorBoundary>

        {/* Simple Footer */}
        <footer className="py-6 text-center text-stone-400 text-sm font-serif italic border-t border-stone-200">
          Powered by AI Librarian &copy; 2026
        </footer>
      </div>
    </Router>
  );
}

export default App;