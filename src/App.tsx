import React, { useState, useEffect, Suspense, lazy } from 'react';
import { storage } from './utils/storage';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './hooks/useAuth';

const ErrorBoundary = lazy(() => import('./components/ErrorBoundary').then(m => ({ default: m.ErrorBoundary })));
const MarketingHub = lazy(() => import('./components/MarketingHub').then(m => ({ default: m.MarketingHub })));
const SplashScreen = lazy(() => import('./components/SplashScreen').then(m => ({ default: m.SplashScreen })));
const OnboardingSlides = lazy(() => import('./components/OnboardingSlides').then(m => ({ default: m.OnboardingSlides })));
const LoginScreen = lazy(() => import('./components/LoginScreen').then(m => ({ default: m.LoginScreen })));
const StoreSetup = lazy(() => import('./components/StoreSetup').then(m => ({ default: m.StoreSetup })));
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const EnhancedBillingScreen = lazy(() => import('./components/EnhancedBillingScreen').then(m => ({ default: m.EnhancedBillingScreen })));
const BillPreview = lazy(() => import('./components/BillPreview').then(m => ({ default: m.BillPreview })));
const InventoryScreen = lazy(() => import('./components/InventoryScreen').then(m => ({ default: m.InventoryScreen })));
const CatalogCreator = lazy(() => import('./components/CatalogCreator').then(m => ({ default: m.CatalogCreator })));
const ReportsScreen = lazy(() => import('./components/ReportsScreen').then(m => ({ default: m.ReportsScreen })));
const SettingsScreen = lazy(() => import('./components/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const WhatsAppAutomation = lazy(() => import('./components/WhatsAppAutomation').then(m => ({ default: m.WhatsAppAutomation })));
const SubscriptionPage = lazy(() => import('./components/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const CustomBillTemplate = lazy(() => import('./components/CustomBillTemplate').then(m => ({ default: m.CustomBillTemplate })));
const AiAssistant = lazy(() => import('./components/AiAssistant').then(m => ({ default: m.AiAssistant })));
const KhataManagement = lazy(() => import('./components/KhataManagement').then(m => ({ default: m.KhataManagement })));
const ExpenseTracker = lazy(() => import('./components/ExpenseTracker').then(m => ({ default: m.ExpenseTracker })));
const NotificationCenter = lazy(() => import('./components/NotificationCenter').then(m => ({ default: m.NotificationCenter })));
const QuickActionsMenu = lazy(() => import('./components/QuickActionsMenu').then(m => ({ default: m.QuickActionsMenu })));
const SalesHistory = lazy(() => import('./components/SalesHistory').then(m => ({ default: m.SalesHistory })));
const BusinessInsights = lazy(() => import('./components/BusinessInsights').then(m => ({ default: m.BusinessInsights })));
const QuickPOSMode = lazy(() => import('./components/QuickPOSMode').then(m => ({ default: m.QuickPOSMode })));
const CustomerManagement = lazy(() => import('./components/CustomerManagement').then(m => ({ default: m.CustomerManagement })));
const BarcodeScanner = lazy(() => import('./components/BarcodeScanner').then(m => ({ default: m.BarcodeScanner })));
const PartyManagement = lazy(() => import('./components/PartyManagement').then(m => ({ default: m.PartyManagement })));
const GSTSettings = lazy(() => import('./components/GSTSettings').then(m => ({ default: m.GSTSettings })));
const LoyaltyProgram = lazy(() => import('./components/LoyaltyProgram').then(m => ({ default: m.LoyaltyProgram })));
const DataBackup = lazy(() => import('./components/DataBackup').then(m => ({ default: m.DataBackup })));
const ReorderAlerts = lazy(() => import('./components/ReorderAlerts').then(m => ({ default: m.ReorderAlerts })));
const SystemHealthMonitor = lazy(() => import('./components/SystemHealthMonitor').then(m => ({ default: m.SystemHealthMonitor })));
const LanguageSwitcher = lazy(() => import('./components/LanguageSwitcher').then(m => ({ default: m.LanguageSwitcher })));
const PrinterSetup = lazy(() => import('./components/PrinterSetup').then(m => ({ default: m.PrinterSetup })));
const EnhancedAdminPanel = lazy(() => import('./components/EnhancedAdminPanel').then(m => ({ default: m.EnhancedAdminPanel })));
const PerformanceMonitor = lazy(() => import('./components/PerformanceMonitor').then(m => ({ default: m.PerformanceMonitor })));
const PWAInstaller = lazy(() => import('./components/PWAInstaller').then(m => ({ default: m.PWAInstaller })));

import { useGlobalSearchShortcut } from './components/GlobalSearch';
import { useKeyboardShortcutsHelp } from './components/KeyboardShortcuts';
const GlobalSearch = lazy(() => import('./components/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const KeyboardShortcuts = lazy(() => import('./components/KeyboardShortcuts').then(m => ({ default: m.KeyboardShortcuts })));

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

function App() {
  const { user, store, loading: authLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('marketing');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storeSetup, setStoreSetup] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Production features state
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: 'Sharma Kirana Store',
    owner: 'Ramesh Sharma',
    address: 'Shop No. 12, Main Market, Delhi',
    phone: '+91 98765 43210',
    billColor: '#1E88E5'
  });
  
  // Sync auth state with app state
  useEffect(() => {
    if (authLoading) return;
    
    if (user && store) {
      setIsLoggedIn(true);
      storage.setLoggedIn(true);
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
      const isStoreComplete = !!(store.address && store.phone);
      setStoreSetup(isStoreComplete);
      if (isStoreComplete) {
        storage.setStoreSetupDone(true);
      }
      if (currentScreen === 'marketing' || currentScreen === 'login') {
        setCurrentScreen(isStoreComplete ? 'dashboard' : 'store-setup');
      }
      
      // Sync data from server after login
      const syncDataFromServer = async () => {
        try {
          const [serverProducts] = await Promise.all([
            storage.fetchProducts(),
            storage.fetchCustomers(),
            storage.fetchBills(),
            storage.fetchKhataEntries(),
            storage.fetchExpenses(),
            storage.fetchParties(),
          ]);
          if (serverProducts.length > 0) {
            setProducts(serverProducts);
          }
        } catch (error) {
          console.error('Failed to sync data from server:', error);
        }
      };
      syncDataFromServer();
    } else {
      // User not authenticated - clear local state
      setIsLoggedIn(false);
      storage.setLoggedIn(false);
    }
  }, [authLoading, user, store]);

  const [currentBill, setCurrentBill] = useState<BillItem[]>([]);
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Maggie', price: 12, stock: 50, category: 'Groceries', image: 'https://images.unsplash.com/photo-1603033172872-c2525115c7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YW50JTIwbm9vZGxlcyUyMG1hZ2dpfGVufDF8fHx8MTc2Mjk0NjcyN3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: '2', name: 'Pepsi 250ml', price: 20, stock: 30, category: 'Beverages', image: 'https://images.unsplash.com/photo-1654420952861-306c4dffa337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBzaSUyMGJvdHRsZSUyMGRyaW5rfGVufDF8fHx8MTc2Mjk0NjcyOHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: '3', name: 'Parle-G', price: 5, stock: 100, category: 'Snacks', image: 'https://images.unsplash.com/photo-1651351978830-99b7125c3ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJsZSUyMGJpc2N1aXRzJTIwY29va2llc3xlbnwxfHx8fDE3NjI5NDY3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: '4', name: 'Tata Tea', price: 120, stock: 25, category: 'Groceries', image: 'https://images.unsplash.com/photo-1597406138443-dfaf216f4efa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjB0YXRhJTIwcGFja2FnZXxlbnwxfHx8fDE3NjI5NDY3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: '5', name: 'Lays Chips', price: 20, stock: 40, category: 'Snacks', image: 'https://images.unsplash.com/photo-1579384264577-79580c9d3a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG8lMjBjaGlwcyUyMHNuYWNrc3xlbnwxfHx8fDE3NjI4NTUyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080' }
  ]);

  // Keyboard shortcuts
  useGlobalSearchShortcut(() => setShowGlobalSearch(true));
  useKeyboardShortcutsHelp(() => setShowKeyboardShortcuts(true));

  // Load persisted data on app start (except login state - that comes from useAuth)
  useEffect(() => {
    const savedOnboarding = !storage.getOnboardingDone();
    const savedStoreInfo = storage.getStoreInfo();
    const savedProducts = storage.getProducts();

    setShowOnboarding(savedOnboarding);

    if (savedStoreInfo) {
      setStoreInfo(savedStoreInfo);
    }

    if (savedProducts.length > 0) {
      setProducts(savedProducts);
    } else {
      storage.setProducts(products);
    }
  }, []);

  // Save products whenever they change
  useEffect(() => {
    if (products.length > 0) {
      storage.setProducts(products);
    }
  }, [products]);

  // Save store info whenever it changes
  useEffect(() => {
    if (storeInfo) {
      storage.setStoreInfo(storeInfo);
    }
  }, [storeInfo]);

  useEffect(() => {
    if (currentScreen === 'splash') {
      setTimeout(() => {
        if (showOnboarding) {
          setCurrentScreen('onboarding');
        } else if (!isLoggedIn) {
          setCurrentScreen('login');
        } else if (!storeSetup) {
          setCurrentScreen('store-setup');
        } else {
          setCurrentScreen('dashboard');
        }
      }, 2000);
    }
  }, [currentScreen, showOnboarding, isLoggedIn, storeSetup]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    storage.setOnboardingDone(true);
    setCurrentScreen('login');
  };

  const handleLoginComplete = () => {
    setIsLoggedIn(true);
    storage.setLoggedIn(true);
    if (!storeSetup) {
      setCurrentScreen('store-setup');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleStoreSetupComplete = (info: StoreInfo) => {
    setStoreInfo(info);
    storage.setStoreInfo(info);
    setStoreSetup(true);
    storage.setStoreSetupDone(true);
    setCurrentScreen('dashboard');
  };

  const navigateTo = (screen: Screen) => {
    // Clear bill when navigating away from bill-preview
    if (currentScreen === 'bill-preview' && (screen === 'dashboard' || screen === 'billing')) {
      setCurrentBill([]);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'marketing':
        return <MarketingHub onStartApp={() => setCurrentScreen('splash')} />;
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingSlides onComplete={handleOnboardingComplete} />;
      case 'login':
        return <LoginScreen onLoginComplete={handleLoginComplete} />;
      case 'store-setup':
        return <StoreSetup onComplete={handleStoreSetupComplete} initialData={storeInfo} />;
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={navigateTo} 
            storeInfo={storeInfo}
            onToggleAI={() => setShowAiAssistant(!showAiAssistant)}
            onToggleQuickActions={() => setShowQuickActions(!showQuickActions)}
            products={products}
            onLogout={logout}
          />
        );
      case 'billing':
        return (
          <EnhancedBillingScreen 
            onNavigate={navigateTo} 
            products={products}
            currentBill={currentBill}
            setCurrentBill={setCurrentBill}
            setProducts={setProducts}
          />
        );
      case 'bill-preview':
        return (
          <BillPreview 
            onNavigate={navigateTo}
            bill={currentBill}
            storeInfo={storeInfo}
          />
        );
      case 'inventory':
        return (
          <InventoryScreen 
            onNavigate={navigateTo}
            products={products}
            setProducts={setProducts}
          />
        );
      case 'catalog':
        return <CatalogCreator onNavigate={navigateTo} products={products} storeInfo={storeInfo} />;
      case 'reports':
        return <ReportsScreen onNavigate={navigateTo} />;
      case 'settings':
        return (
          <SettingsScreen 
            onNavigate={navigateTo}
            storeInfo={storeInfo}
            setStoreInfo={setStoreInfo}
          />
        );
      case 'whatsapp':
        return <WhatsAppAutomation onNavigate={navigateTo} />;
      case 'subscription':
        return <SubscriptionPage onNavigate={navigateTo} />;
      case 'bill-template':
        return (
          <CustomBillTemplate 
            onNavigate={navigateTo}
            storeInfo={storeInfo}
            setStoreInfo={setStoreInfo}
          />
        );
      case 'khata':
        return <KhataManagement onNavigate={navigateTo} />;
      case 'expenses':
        return <ExpenseTracker onNavigate={navigateTo} />;
      case 'notifications':
        return <NotificationCenter onNavigate={navigateTo} />;
      case 'sales-history':
        return <SalesHistory onNavigate={navigateTo} />;
      case 'business-insights':
        return <BusinessInsights onNavigate={navigateTo} />;
      case 'quick-pos':
        return <QuickPOSMode onNavigate={navigateTo} products={products} />;
      case 'customers':
        return <CustomerManagement onNavigate={navigateTo} />;
      case 'barcode-scanner':
        return <BarcodeScanner onNavigate={navigateTo} products={products} />;
      case 'parties':
        return <PartyManagement onNavigate={navigateTo} />;
      case 'gst-settings':
        return <GSTSettings onNavigate={navigateTo} />;
      case 'loyalty-program':
        return <LoyaltyProgram onNavigate={navigateTo} />;
      case 'data-backup':
        return <DataBackup onNavigate={navigateTo} />;
      case 'reorder-alerts':
        return <ReorderAlerts onNavigate={navigateTo} />;
      case 'system-health':
        return <SystemHealthMonitor onNavigate={navigateTo} />;
      case 'language-switcher':
        return <LanguageSwitcher onNavigate={navigateTo} />;
      case 'printer-setup':
        return <PrinterSetup onNavigate={navigateTo} />;
      case 'admin-panel':
        return <EnhancedAdminPanel onNavigate={navigateTo} />;
      default:
        return <Dashboard onNavigate={navigateTo} storeInfo={storeInfo} onLogout={logout} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        {renderScreen()}
        
        {/* Dashboard Overlays */}
        {currentScreen === 'dashboard' && (
          <>
            <AiAssistant 
              isOpen={showAiAssistant} 
              onToggle={() => setShowAiAssistant(!showAiAssistant)}
              onNavigate={navigateTo}
            />
            <QuickActionsMenu 
              isOpen={showQuickActions} 
              onToggle={() => setShowQuickActions(!showQuickActions)}
              onNavigate={navigateTo}
            />
          </>
        )}

        {/* Global Production Features */}
        <GlobalSearch
          isOpen={showGlobalSearch}
          onClose={() => setShowGlobalSearch(false)}
          onNavigate={navigateTo}
          products={products}
        />

        <KeyboardShortcuts
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />

        <PerformanceMonitor />
        <PWAInstaller />
        
        <Toaster />
      </Suspense>
    </div>
  );
}

export default App;