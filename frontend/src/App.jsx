import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Discovery from './pages/Discovery';

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
import Articles from './pages/Articles'; // Новый импорт для страницы статей

// 3. Global Styles
import './App.css';

function App() {
  return (
    <Router>
      {/* Глобальные уведомления с красивым шрифтом под стиль библиотеки */}
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
        {/* Навигация всегда сверху (не забудь добавить ссылку на Articles в сам компонент Navbar!) */}
        <Navbar />

        {/* Предохранитель: если страница "упадет", ErrorBoundary покажет запасной интерфейс */}
        <ErrorBoundary>
          <main className="flex-grow">
            <Routes>
              {/* --- Public Routes (Доступны всем) --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/discovery" element={<Discovery />} />
              
              {/* Новый маршрут для статей — обычно они публичные */}
              <Route path="/articles" element={<Articles />} />

              {/* --- Protected Routes (Только для авторизованных пользователей) --- */}
              {/* PrivateRoute защищает от ошибок "reading properties of null" при отсутствии токена */}
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

              {/* --- Logic Routes (Перенаправления) --- */}
              {/* Главная страница по умолчанию ведет на рекомендации */}
              <Route path="/" element={<Navigate to="/recommend" replace />} />
              
              {/* 404: Если адрес не найден, отправляем пользователя на главную */}
              <Route path="*" element={<Navigate to="/recommend" replace />} />
            </Routes>
          </main>
        </ErrorBoundary>

        {/* Подвал в винтажном стиле */}
        <footer className="py-6 text-center text-stone-400 text-sm font-serif italic border-t border-stone-200">
          Powered by AI Librarian &copy; 2026
        </footer>
      </div>
    </Router>
  );
}

export default App;