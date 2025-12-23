import { useState, useEffect, lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashScreen } from './components/SplashScreen';
import { Toaster } from './components/ui/sonner';
import { storage } from './utils/storage';
import type { Screen, Product, BillItem, StoreInfo, Customer, Bill } from './types';

// NEW ENHANCEMENTS - Toolbar (includes all enhancement components)
import { EnhancementToolbar } from './components/EnhancementToolbar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { WhatsNewShowcase, useWhatsNew } from './components/WhatsNewShowcase';
import { OnboardingTour } from './components/OnboardingTour';
import { ContextualTips } from './components/ContextualTips';
import { AchievementSystem, AchievementNotification, useAchievements } from './components/AchievementSystem';
import { AchievementTrigger } from './components/AchievementTrigger';
import { AchievementButton } from './components/AchievementButton';
import { DailyChallenges } from './components/DailyChallenges';
import { DailyChallengeButton } from './components/DailyChallengeButton';
import { Leaderboard, LeaderboardButton } from './components/Leaderboard';

// Re-export types for backward compatibility
export type { Screen, Product, BillItem, StoreInfo, Customer, Bill };

// Lazy load route components for better performance
const MarketingHub = lazy(() => import('./components/MarketingHub').then(m => ({ default: m.MarketingHub })));
const OnboardingSlides = lazy(() => import('./components/OnboardingSlides').then(m => ({ default: m.OnboardingSlides })));
const AuthScreen = lazy(() => import('./components/AuthScreen').then(m => ({ default: m.AuthScreen })));
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
const GlobalSearch = lazy(() => import('./components/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const KeyboardShortcuts = lazy(() => import('./components/KeyboardShortcuts').then(m => ({ default: m.KeyboardShortcuts })));
const VoiceSupportBanner = lazy(() => import('./components/VoiceSupportBanner').then(m => ({ default: m.VoiceSupportBanner })));
const GlobalVoiceSearch = lazy(() => import('./components/GlobalVoiceSearch').then(m => ({ default: m.GlobalVoiceSearch })));
const BrowserCompatibilityBanner = lazy(() => import('./components/BrowserCompatibilityBanner').then(m => ({ default: m.BrowserCompatibilityBanner })));
const VoiceTutorial = lazy(() => import('./components/VoiceTutorial').then(m => ({ default: m.VoiceTutorial })));
const FloatingHelpButton = lazy(() => import('./components/FloatingHelpButton').then(m => ({ default: m.FloatingHelpButton })));

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('marketing');
  const [showOnboarding, setShowOnboarding] = useState(false); // Changed from true to false - will be loaded from storage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storeSetup, setStoreSetup] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Track if initial navigation has completed to prevent re-showing onboarding
  const [initialNavigationDone, setInitialNavigationDone] = useState(false);
  
  // Track if voice tutorial check has been done to prevent repeated checks
  const [voiceTutorialCheckDone, setVoiceTutorialCheckDone] = useState(false);
  
  // Production features state
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showVoiceTutorial, setShowVoiceTutorial] = useState(false); // New: Voice tutorial state
  
  // NEW ENHANCEMENTS - What's New showcase
  const { showWhatsNew, setShowWhatsNew } = useWhatsNew();
  
  // NEW ENHANCEMENTS - Onboarding Tour (shown once after store setup)
  const [showOnboardingTour, setShowOnboardingTour] = useState(false);
  
  // NEW ENHANCEMENTS - Achievement System
  const [showAchievements, setShowAchievements] = useState(false);
  const { showNotification, currentAchievement, closeNotification } = useAchievements();
  
  // NEW ENHANCEMENTS - Daily Challenges
  const [showDailyChallenges, setShowDailyChallenges] = useState(false);
  
  // NEW ENHANCEMENTS - Leaderboard
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
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

  // Mock customers data
  const mockCustomers: Customer[] = [
    { id: '1', name: 'Ramesh Kumar', phone: '+91 98765 43210', email: 'ramesh@example.com' },
    { id: '2', name: 'Priya Sharma', phone: '+91 87654 32109' },
    { id: '3', name: 'Amit Singh', phone: '+91 76543 21098', email: 'amit@example.com' },
    { id: '4', name: 'Neha Gupta', phone: '+91 65432 10987' },
  ];

  // Mock bills data
  const mockBills: Bill[] = [
    { id: '1', billNo: 1001, customerName: 'Ramesh Kumar', total: 450, date: '2024-12-15' },
    { id: '2', billNo: 1002, customerName: 'Priya Sharma', total: 320, date: '2024-12-15' },
    { id: '3', billNo: 1003, customerName: 'Amit Singh', total: 680, date: '2024-12-14' },
    { id: '4', billNo: 1004, customerName: 'Neha Gupta', total: 150, date: '2024-12-14' },
  ];

  // Keyboard shortcuts - Load hooks eagerly
  useEffect(() => {
    // Global search shortcut (Ctrl/Cmd + K)
    const handleGlobalSearch = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };
    
    // Keyboard shortcuts help (Ctrl/Cmd + /)
    const handleKeyboardHelp = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };
    
    // Voice Search shortcut (Ctrl/Cmd + Shift + V)
    const handleVoiceSearchShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        setShowVoiceSearch(true);
      }
    };
    
    window.addEventListener('keydown', handleGlobalSearch);
    window.addEventListener('keydown', handleKeyboardHelp);
    window.addEventListener('keydown', handleVoiceSearchShortcut);
    
    return () => {
      window.removeEventListener('keydown', handleGlobalSearch);
      window.removeEventListener('keydown', handleKeyboardHelp);
      window.removeEventListener('keydown', handleVoiceSearchShortcut);
    };
  }, []);

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

    // Set initial screen based on saved state
    if (storage.getOnboardingDone()) {
      // User has completed onboarding before
      if (savedLogin && savedStoreSetup) {
        setCurrentScreen('dashboard');
      } else if (savedLogin) {
        setCurrentScreen('store-setup');
      } else {
        setCurrentScreen('login');
      }
    }
    // else: stays on 'marketing' screen (default)
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
    if (currentScreen === 'splash' && !initialNavigationDone) {
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
        setInitialNavigationDone(true); // Mark initial navigation as complete
      }, 2000);
    }
  }, [currentScreen, showOnboarding, isLoggedIn, storeSetup, initialNavigationDone]);

  // Auto-show Voice Tutorial on first dashboard visit
  useEffect(() => {
    if (currentScreen === 'dashboard' && isLoggedIn && storeSetup && !voiceTutorialCheckDone) {
      const tutorialCompleted = localStorage.getItem('voice-tutorial-completed');
      if (!tutorialCompleted) {
        // Delay tutorial slightly so dashboard loads first
        setTimeout(() => {
          setShowVoiceTutorial(true);
          console.log('🎤 Auto-showing Voice Tutorial for first-time user');
        }, 1500);
      }
      setVoiceTutorialCheckDone(true); // Mark voice tutorial check as done
    }
  }, [currentScreen, isLoggedIn, storeSetup, voiceTutorialCheckDone]);

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
    
    // Show onboarding tour after store setup (only for first-time users)
    const tourCompleted = localStorage.getItem('onboarding-tour-completed');
    const tourSkipped = localStorage.getItem('onboarding-tour-skipped');
    if (!tourCompleted && !tourSkipped) {
      setTimeout(() => {
        setShowOnboardingTour(true);
      }, 1000); // Delay slightly so dashboard loads first
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    storage.setLoggedIn(false);
    setCurrentScreen('login');
  };

  const navigateTo = (screen: Screen) => {
    // Clear bill when navigating away from bill-preview
    if (currentScreen === 'bill-preview' && (screen === 'dashboard' || screen === 'billing')) {
      setCurrentBill([]);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    const screen = (() => {
      switch (currentScreen) {
        case 'marketing':
          return <MarketingHub onStartApp={() => setCurrentScreen('splash')} />;
        case 'splash':
          return <SplashScreen />;
        case 'onboarding':
          return <OnboardingSlides onComplete={handleOnboardingComplete} />;
        case 'login':
          return <AuthScreen onAuthComplete={handleLoginComplete} />;
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
              onLogout={handleLogout}
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
          return (
            <Dashboard 
              onNavigate={navigateTo} 
              storeInfo={storeInfo}
              onToggleAI={() => setShowAiAssistant(!showAiAssistant)}
              onToggleQuickActions={() => setShowQuickActions(!showQuickActions)}
              products={products}
            />
          );
      }
    })();
    
    // Wrap in Suspense with loading fallback
    return (
      <Suspense fallback={<SplashScreen />}>
        {screen}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        {renderScreen()}
        
        {/* Dashboard Overlays */}
        {currentScreen === 'dashboard' && (
          <>
            <Suspense fallback={null}>
              <AiAssistant 
                isOpen={showAiAssistant} 
                onToggle={() => setShowAiAssistant(!showAiAssistant)}
                onNavigate={navigateTo}
              />
            </Suspense>
            <Suspense fallback={null}>
              <QuickActionsMenu 
                isOpen={showQuickActions} 
                onToggle={() => setShowQuickActions(!showQuickActions)}
                onNavigate={navigateTo}
              />
            </Suspense>
          </>
        )}

        {/* Global Production Features */}
        <Suspense fallback={null}>
          <GlobalSearch
            isOpen={showGlobalSearch}
            onClose={() => setShowGlobalSearch(false)}
            onNavigate={navigateTo}
            products={products}
          />
        </Suspense>

        <Suspense fallback={null}>
          <KeyboardShortcuts
            isOpen={showKeyboardShortcuts}
            onClose={() => setShowKeyboardShortcuts(false)}
          />
        </Suspense>

        <Suspense fallback={null}>
          <PerformanceMonitor />
        </Suspense>
        
        <Suspense fallback={null}>
          <PWAInstaller />
        </Suspense>
        
        <Toaster />
        
        <Suspense fallback={null}>
          <VoiceSupportBanner />
        </Suspense>
        
        {/* Global Voice Search */}
        {showVoiceSearch && (
          <Suspense fallback={null}>
            <GlobalVoiceSearch
              onClose={() => setShowVoiceSearch(false)}
              onNavigate={navigateTo}
              products={products}
              customers={mockCustomers}
              bills={mockBills}
            />
          </Suspense>
        )}
        
        {/* Voice Tutorial */}
        {showVoiceTutorial && (
          <Suspense fallback={null}>
            <VoiceTutorial
              onClose={() => setShowVoiceTutorial(false)}
            />
          </Suspense>
        )}
        
        {/* Browser Compatibility Banner */}
        <Suspense fallback={null}>
          <BrowserCompatibilityBanner />
        </Suspense>
        
        {/* Floating Help Button */}
        <Suspense fallback={null}>
          <FloatingHelpButton />
        </Suspense>
        
        {/* NEW ENHANCEMENTS - Toolbar with all enhancement tools - HIDDEN TO REDUCE UI CLUTTER */}
        {/* Accessible via Settings or Admin Panel */}
        {/* <EnhancementToolbar 
          products={products}
          onProductsImport={(newProducts) => {
            setProducts([...products, ...newProducts]);
          }}
          onDateRangeSelect={(start, end, label) => {
            console.log(`Date range selected: ${label}`, start, end);
          }}
        /> */}
        
        {/* NEW ENHANCEMENTS - Offline Indicator */}
        <OfflineIndicator />
        
        {/* NEW ENHANCEMENTS - Whats New Showcase */}
        <WhatsNewShowcase 
          isOpen={showWhatsNew} 
          onClose={() => setShowWhatsNew(false)} 
        />
        
        {/* NEW ENHANCEMENTS - Onboarding Tour */}
        <OnboardingTour 
          isOpen={showOnboardingTour} 
          onClose={() => setShowOnboardingTour(false)} 
        />
        
        {/* NEW ENHANCEMENTS - Contextual Tips */}
        <ContextualTips />
        
        {/* NEW ENHANCEMENTS - Achievement System */}
        <Suspense fallback={null}>
          <AchievementSystem 
            isOpen={showAchievements}
            onClose={() => setShowAchievements(false)}
          />
        </Suspense>
        
        {/* NEW ENHANCEMENTS - Achievement Notification */}
        <Suspense fallback={null}>
          {showNotification && currentAchievement && (
            <AchievementNotification 
              achievement={currentAchievement}
              onClose={closeNotification}
            />
          )}
        </Suspense>
        
        {/* NEW ENHANCEMENTS - Achievement Trigger (tracks user actions) */}
        <Suspense fallback={null}>
          <AchievementTrigger
            isLoggedIn={isLoggedIn}
            storeSetup={storeSetup}
            productCount={products.length}
            billCount={mockBills.length}
            customerCount={mockCustomers.length}
          />
        </Suspense>
        
        {/* NEW ENHANCEMENTS - Achievement Button (floating button) - HIDDEN TO REDUCE CLUTTER */}
        {/* Accessible via Enhancement Toolbar at bottom */}
        
        {/* NEW ENHANCEMENTS - Daily Challenges */}
        <Suspense fallback={null}>
          <DailyChallenges 
            isOpen={showDailyChallenges}
            onClose={() => setShowDailyChallenges(false)}
            billCount={mockBills.length}
            productCount={products.length}
            customerCount={mockCustomers.length}
          />
        </Suspense>
        
        {/* NEW ENHANCEMENTS - Daily Challenge Button (floating button) - HIDDEN TO REDUCE CLUTTER */}
        {/* Accessible via Enhancement Toolbar at bottom */}
        
        {/* NEW ENHANCEMENTS - Leaderboard */}
        <Suspense fallback={null}>
          <Leaderboard 
            isOpen={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
            billCount={mockBills.length}
            productCount={products.length}
            customerCount={mockCustomers.length}
          />
        </Suspense>
        
        {/* NEW ENHANCEMENTS - Leaderboard Button (floating button) - HIDDEN TO REDUCE CLUTTER */}
        {/* Accessible via Enhancement Toolbar at bottom */}
      </ErrorBoundary>
    </div>
  );
}

export default App;