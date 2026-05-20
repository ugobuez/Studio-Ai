import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import Generate from './pages/Generate';
import Library from './pages/Library';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { useAuthStore } from './context/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="app-wrapper">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </AnimatePresence>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 12, 41, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255, 210, 0, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
          },
        }}
      />
    </div>
  );
}

export default App;