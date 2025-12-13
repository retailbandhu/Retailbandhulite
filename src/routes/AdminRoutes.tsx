import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

const EnhancedAdminPanel = lazy(() => import('../components/EnhancedAdminPanel').then(m => ({ default: m.EnhancedAdminPanel })));
const AdminLogin = lazy(() => import('../components/AdminLogin').then(m => ({ default: m.AdminLogin })));

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading Admin Panel...</p>
      </div>
    </div>
  );
}

export function AdminRoutes() {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    setIsAdminAuthenticated(false);
  };

  const handleNavigate = (screen: string) => {
    if (screen === 'dashboard' || screen === 'marketing') {
      navigate('/');
    } else if (screen === 'admin-logout') {
      handleAdminLogout();
    } else {
      navigate(`/app/${screen}`);
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={
          isAdminAuthenticated ? 
            <Navigate to="/admin" replace /> : 
            <AdminLogin onLoginSuccess={handleAdminLogin} onBack={() => navigate('/')} />
        } />
        <Route path="/" element={
          isAdminAuthenticated ? 
            <EnhancedAdminPanel onNavigate={handleNavigate} /> : 
            <Navigate to="/admin/login" replace />
        } />
        <Route path="/*" element={
          isAdminAuthenticated ? 
            <EnhancedAdminPanel onNavigate={handleNavigate} /> : 
            <Navigate to="/admin/login" replace />
        } />
      </Routes>
    </Suspense>
  );
}
