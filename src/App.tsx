import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './hooks/useAuth';

import { LandingRoutes } from './routes/LandingRoutes';
import { AppRoutes } from './routes/AppRoutes';
import { AdminRoutes } from './routes/AdminRoutes';

export type { StoreInfo, Product, BillItem } from './routes/AppRoutes';

export type Screen = 
  | 'marketing'
  | 'splash' 
  | 'onboarding' 
  | 'login' 
  | 'store-setup' 
  | 'dashboard' 
  | 'billing' 
  | 'bill-preview'
  | 'inventory' 
  | 'catalog' 
  | 'reports' 
  | 'settings'
  | 'whatsapp'
  | 'subscription'
  | 'bill-template'
  | 'khata'
  | 'expenses'
  | 'notifications'
  | 'sales-history'
  | 'business-insights'
  | 'quick-pos'
  | 'customers'
  | 'barcode-scanner'
  | 'parties'
  | 'gst-settings'
  | 'loyalty-program'
  | 'data-backup'
  | 'reorder-alerts'
  | 'system-health'
  | 'language-switcher'
  | 'printer-setup'
  | 'about-us'
  | 'blog'
  | 'careers'
  | 'contact'
  | 'videos'
  | 'faq'
  | 'admin-panel';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleStartApp = () => {
    navigate('/app');
  };

  return (
    <Routes>
      {/* Landing Page - Marketing Website */}
      <Route path="/*" element={<LandingRoutes onStartApp={handleStartApp} />} />
      
      {/* Main App - Kirana Store App (PWA for Play Store) */}
      <Route path="/app/*" element={<AppRoutes />} />
      
      {/* Admin Panel - Protected Admin Dashboard */}
      <Route path="/admin/*" element={<AdminRoutes isAuthenticated={!!user} isAdmin={true} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <AppContent />
      </Suspense>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
