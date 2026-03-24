import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Recommend from './pages/Recommend';
import Articles from './pages/Articles';
import CreateArticle from './pages/CreateArticle';
import Login from './pages/Login';
import Register from './pages/Register';
import Discovery from './pages/Discovery';
import Library from './pages/Library';
import NookDetail from './pages/NookDetail'; // The view for specific collections
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      {/* Toast notifications for "Hearts" and "Saves" */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#432818',
            color: '#fdfaf5',
            fontFamily: 'serif',
            fontSize: '12px',
            borderRadius: '99px',
          },
        }}
      />
      
      <div className="min-h-screen bg-[#fdfaf5] flex flex-col">
        {/* The Navbar stays outside the Routes so it never disappears */}
        <Navbar /> 
        
        <main className="flex-grow">
          <Routes>
            {/* Public Records */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/articles" element={<Articles />} />
            
            {/* Private Archives (Protected) */}
            <Route path="/recommend" element={
              <PrivateRoute><Recommend /></PrivateRoute>
            } />
            
            <Route path="/library" element={
              <PrivateRoute><Library /></PrivateRoute>
            } />
            
            <Route path="/library/nook/:id" element={
              <PrivateRoute><NookDetail /></PrivateRoute>
            } />
            
            // Inside your Routes block
            <Route path="/nooks" element={<MyNooks />} />

            <Route path="/articles/create" element={
              <PrivateRoute><CreateArticle /></PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />

            {/* Default Path: Direct to the Consultation Room */}
            <Route path="/" element={<Navigate to="/recommend" replace />} />
            
            {/* Catch-all for wandering patrons */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;