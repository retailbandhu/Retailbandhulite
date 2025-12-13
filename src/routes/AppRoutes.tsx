import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';

const SplashScreen = lazy(() => import('../components/SplashScreen').then(m => ({ default: m.SplashScreen })));
const OnboardingSlides = lazy(() => import('../components/OnboardingSlides').then(m => ({ default: m.OnboardingSlides })));
const LoginScreen = lazy(() => import('../components/LoginScreen').then(m => ({ default: m.LoginScreen })));
const StoreSetup = lazy(() => import('../components/StoreSetup').then(m => ({ default: m.StoreSetup })));
const Dashboard = lazy(() => import('../components/Dashboard').then(m => ({ default: m.Dashboard })));
const EnhancedBillingScreen = lazy(() => import('../components/EnhancedBillingScreen').then(m => ({ default: m.EnhancedBillingScreen })));
const BillPreview = lazy(() => import('../components/BillPreview').then(m => ({ default: m.BillPreview })));
const InventoryScreen = lazy(() => import('../components/InventoryScreen').then(m => ({ default: m.InventoryScreen })));
const CatalogCreator = lazy(() => import('../components/CatalogCreator').then(m => ({ default: m.CatalogCreator })));
const ReportsScreen = lazy(() => import('../components/ReportsScreen').then(m => ({ default: m.ReportsScreen })));
const SettingsScreen = lazy(() => import('../components/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const WhatsAppAutomation = lazy(() => import('../components/WhatsAppAutomation').then(m => ({ default: m.WhatsAppAutomation })));
const SubscriptionPage = lazy(() => import('../components/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const CustomBillTemplate = lazy(() => import('../components/CustomBillTemplate').then(m => ({ default: m.CustomBillTemplate })));
const KhataManagement = lazy(() => import('../components/KhataManagement').then(m => ({ default: m.KhataManagement })));
const ExpenseTracker = lazy(() => import('../components/ExpenseTracker').then(m => ({ default: m.ExpenseTracker })));
const NotificationCenter = lazy(() => import('../components/NotificationCenter').then(m => ({ default: m.NotificationCenter })));
const SalesHistory = lazy(() => import('../components/SalesHistory').then(m => ({ default: m.SalesHistory })));
const BusinessInsights = lazy(() => import('../components/BusinessInsights').then(m => ({ default: m.BusinessInsights })));
const QuickPOSMode = lazy(() => import('../components/QuickPOSMode').then(m => ({ default: m.QuickPOSMode })));
const CustomerManagement = lazy(() => import('../components/CustomerManagement').then(m => ({ default: m.CustomerManagement })));
const BarcodeScanner = lazy(() => import('../components/BarcodeScanner').then(m => ({ default: m.BarcodeScanner })));
const PartyManagement = lazy(() => import('../components/PartyManagement').then(m => ({ default: m.PartyManagement })));
const GSTSettings = lazy(() => import('../components/GSTSettings').then(m => ({ default: m.GSTSettings })));
const LoyaltyProgram = lazy(() => import('../components/LoyaltyProgram').then(m => ({ default: m.LoyaltyProgram })));
const DataBackup = lazy(() => import('../components/DataBackup').then(m => ({ default: m.DataBackup })));
const ReorderAlerts = lazy(() => import('../components/ReorderAlerts').then(m => ({ default: m.ReorderAlerts })));
const SystemHealthMonitor = lazy(() => import('../components/SystemHealthMonitor').then(m => ({ default: m.SystemHealthMonitor })));
const LanguageSwitcher = lazy(() => import('../components/LanguageSwitcher').then(m => ({ default: m.LanguageSwitcher })));
const PrinterSetup = lazy(() => import('../components/PrinterSetup').then(m => ({ default: m.PrinterSetup })));
const AiAssistant = lazy(() => import('../components/AiAssistant').then(m => ({ default: m.AiAssistant })));
const QuickActionsMenu = lazy(() => import('../components/QuickActionsMenu').then(m => ({ default: m.QuickActionsMenu })));

export interface StoreInfo {
  id?: string;
  name: string;
  owner: string;
  address: string;
  phone: string;
  logo?: string;
  billColor?: string;
  gstin?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  barcode?: string;
  hsnCode?: string;
  gstRate?: number;
}

export interface BillItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

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

interface RequireAuthProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isStoreSetup: boolean;
  authLoading: boolean;
}

function RequireAuth({ children, isAuthenticated, isStoreSetup, authLoading }: RequireAuthProps) {
  if (authLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/app/login" replace />;
  }
  
  if (!isStoreSetup) {
    return <Navigate to="/app/store-setup" replace />;
  }
  
  return <>{children}</>;
}

export function AppRoutes() {
  const navigate = useNavigate();
  const { user, store, loading: authLoading, logout } = useAuth();
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [currentBill, setCurrentBill] = useState<BillItem[]>([]);
  
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: 'Sharma Kirana Store',
    owner: 'Ramesh Sharma',
    address: 'Shop No. 12, Main Market, Delhi',
    phone: '+91 98765 43210',
    billColor: '#1E88E5'
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = storage.getProducts();
    return saved.length > 0 ? saved : [
      { id: '1', name: 'Maggie', price: 12, stock: 50, category: 'Groceries' },
      { id: '2', name: 'Pepsi 250ml', price: 20, stock: 30, category: 'Beverages' },
      { id: '3', name: 'Parle-G', price: 5, stock: 100, category: 'Snacks' },
      { id: '4', name: 'Tata Tea', price: 120, stock: 25, category: 'Groceries' },
      { id: '5', name: 'Lays Chips', price: 20, stock: 40, category: 'Snacks' }
    ];
  });

  useEffect(() => {
    if (!authLoading && user && store) {
      setStoreInfo({
        id: String(store.id),
        name: store.name,
        owner: store.owner,
        address: store.address || '',
        phone: store.phone || '',
        logo: store.logo || undefined,
        billColor: store.billColor || '#1E88E5',
        gstin: store.gstin || undefined,
      });
    }
  }, [authLoading, user, store]);

  useEffect(() => {
    if (products.length > 0) {
      storage.setProducts(products);
    }
  }, [products]);

  const handleNavigate = (screen: string) => {
    if (screen === 'dashboard') {
      navigate('/app');
    } else if (screen === 'admin-panel') {
      navigate('/admin');
    } else {
      navigate(`/app/${screen}`);
    }
  };

  const isAuthenticated = !!user;
  const isStoreSetup = !!(store?.address && store?.phone);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {showAiAssistant && (
        <AiAssistant onClose={() => setShowAiAssistant(false)} onNavigate={handleNavigate} />
      )}
      {showQuickActions && (
        <QuickActionsMenu onClose={() => setShowQuickActions(false)} onNavigate={handleNavigate} />
      )}
      
      <Routes>
        <Route path="/" element={
          <RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}>
            <Dashboard 
              onNavigate={handleNavigate} 
              storeInfo={storeInfo}
              onToggleAI={() => setShowAiAssistant(!showAiAssistant)}
              onToggleQuickActions={() => setShowQuickActions(!showQuickActions)}
              products={products}
              onLogout={logout}
            />
          </RequireAuth>
        } />
        <Route path="/login" element={<LoginScreen onLoginComplete={() => navigate('/app')} />} />
        <Route path="/store-setup" element={
          !isAuthenticated ? <Navigate to="/app/login" replace /> :
          <StoreSetup 
            onComplete={(info) => {
              setStoreInfo(info);
              storage.setStoreInfo(info);
              navigate('/app');
            }} 
            initialData={storeInfo} 
          />
        } />
        <Route path="/billing" element={
          <RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}>
            <EnhancedBillingScreen 
              onNavigate={handleNavigate} 
              products={products}
              currentBill={currentBill}
              setCurrentBill={setCurrentBill}
              setProducts={setProducts}
            />
          </RequireAuth>
        } />
        <Route path="/bill-preview" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><BillPreview onNavigate={handleNavigate} bill={currentBill} storeInfo={storeInfo} /></RequireAuth>} />
        <Route path="/inventory" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><InventoryScreen onNavigate={handleNavigate} products={products} setProducts={setProducts} /></RequireAuth>} />
        <Route path="/catalog" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><CatalogCreator onNavigate={handleNavigate} products={products} storeInfo={storeInfo} /></RequireAuth>} />
        <Route path="/reports" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><ReportsScreen onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><SettingsScreen onNavigate={handleNavigate} storeInfo={storeInfo} setStoreInfo={setStoreInfo} /></RequireAuth>} />
        <Route path="/whatsapp" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><WhatsAppAutomation onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/subscription" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><SubscriptionPage onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/bill-template" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><CustomBillTemplate onNavigate={handleNavigate} storeInfo={storeInfo} setStoreInfo={setStoreInfo} /></RequireAuth>} />
        <Route path="/khata" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><KhataManagement onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/expenses" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><ExpenseTracker onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><NotificationCenter onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/sales-history" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><SalesHistory onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/business-insights" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><BusinessInsights onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/quick-pos" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><QuickPOSMode onNavigate={handleNavigate} products={products} setProducts={setProducts} /></RequireAuth>} />
        <Route path="/customers" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><CustomerManagement onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/barcode-scanner" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><BarcodeScanner onNavigate={handleNavigate} products={products} setProducts={setProducts} /></RequireAuth>} />
        <Route path="/parties" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><PartyManagement onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/gst-settings" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><GSTSettings onNavigate={handleNavigate} storeInfo={storeInfo} setStoreInfo={setStoreInfo} /></RequireAuth>} />
        <Route path="/loyalty-program" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><LoyaltyProgram onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/data-backup" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><DataBackup onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/reorder-alerts" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><ReorderAlerts onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/system-health" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><SystemHealthMonitor onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/language-switcher" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><LanguageSwitcher onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/printer-setup" element={<RequireAuth isAuthenticated={isAuthenticated} isStoreSetup={isStoreSetup} authLoading={authLoading}><PrinterSetup onNavigate={handleNavigate} /></RequireAuth>} />
      </Routes>
    </Suspense>
  );
}
