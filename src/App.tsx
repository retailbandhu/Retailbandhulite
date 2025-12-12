import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MarketingHub } from './components/MarketingHub';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingSlides } from './components/OnboardingSlides';
import { LoginScreen } from './components/LoginScreen';
import { StoreSetup } from './components/StoreSetup';
import { Dashboard } from './components/Dashboard';
import { EnhancedBillingScreen } from './components/EnhancedBillingScreen';
import { BillPreview } from './components/BillPreview';
import { InventoryScreen } from './components/InventoryScreen';
import { CatalogCreator } from './components/CatalogCreator';
import { ReportsScreen } from './components/ReportsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { WhatsAppAutomation } from './components/WhatsAppAutomation';
import { SubscriptionPage } from './components/SubscriptionPage';
import { CustomBillTemplate } from './components/CustomBillTemplate';
import { AiAssistant } from './components/AiAssistant';
import { KhataManagement } from './components/KhataManagement';
import { ExpenseTracker } from './components/ExpenseTracker';
import { NotificationCenter } from './components/NotificationCenter';
import { QuickActionsMenu } from './components/QuickActionsMenu';
import { SalesHistory } from './components/SalesHistory';
import { BusinessInsights } from './components/BusinessInsights';
import { QuickPOSMode } from './components/QuickPOSMode';
import { CustomerManagement } from './components/CustomerManagement';
import { BarcodeScanner } from './components/BarcodeScanner';
import { PartyManagement } from './components/PartyManagement';
import { GSTSettings } from './components/GSTSettings';
import { LoyaltyProgram } from './components/LoyaltyProgram';
import { DataBackup } from './components/DataBackup';
import { ReorderAlerts } from './components/ReorderAlerts';
import { SystemHealthMonitor } from './components/SystemHealthMonitor';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PrinterSetup } from './components/PrinterSetup';
import { EnhancedAdminPanel } from './components/EnhancedAdminPanel';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { PWAInstaller } from './components/PWAInstaller';
import { GlobalSearch, useGlobalSearchShortcut } from './components/GlobalSearch';
import { KeyboardShortcuts, useKeyboardShortcutsHelp } from './components/KeyboardShortcuts';
import { storage } from './utils/storage';
import { Toaster } from './components/ui/sonner';

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

  // Load persisted data on app start
  useEffect(() => {
    const savedOnboarding = !storage.getOnboardingDone();
    const savedLogin = storage.getLoggedIn();
    const savedStoreSetup = storage.getStoreSetupDone();
    const savedStoreInfo = storage.getStoreInfo();
    const savedProducts = storage.getProducts();

    setShowOnboarding(savedOnboarding);
    setIsLoggedIn(savedLogin);
    setStoreSetup(savedStoreSetup);

    if (savedStoreInfo) {
      setStoreInfo(savedStoreInfo);
    }

    if (savedProducts.length > 0) {
      setProducts(savedProducts);
    } else {
      // Save default products on first load
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
        return <Dashboard onNavigate={navigateTo} storeInfo={storeInfo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
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
      </ErrorBoundary>
    </div>
  );
}

export default App;