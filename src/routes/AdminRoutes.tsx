import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

const EnhancedAdminPanel = lazy(() => import('../components/EnhancedAdminPanel').then(m => ({ default: m.EnhancedAdminPanel })));

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

interface AdminRoutesProps {
  isAuthenticated: boolean;
  isAdmin?: boolean;
}

export function AdminRoutes({ isAuthenticated, isAdmin = true }: AdminRoutesProps) {
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />;
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the Admin Panel.</p>
          <button 
            onClick={() => navigate('/app')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to App
          </button>
        </div>
      </div>
    );
  }

  const handleNavigate = (screen: string) => {
    if (screen === 'dashboard') {
      navigate('/app');
    } else {
      navigate(`/app/${screen}`);
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<EnhancedAdminPanel onNavigate={handleNavigate} />} />
        <Route path="/*" element={<EnhancedAdminPanel onNavigate={handleNavigate} />} />
      </Routes>
    </Suspense>
  );
}
