import React, { useState, useEffect } from 'react';
import { LandingPage } from './LandingPage';
import { AboutUs } from './AboutUs';
import { BlogPage } from './BlogPage';
import { CareersPage } from './CareersPage';
import { ContactPage } from './ContactPage';
import { VideoPage } from './VideoPage';
import { FAQPage } from './FAQPage';
import { EnhancedAdminPanel } from './EnhancedAdminPanel';
import { Screen } from '../types';

interface MarketingHubProps {
  onStartApp: () => void;
}

export function MarketingHub({ onStartApp }: MarketingHubProps) {
  const [currentView, setCurrentView] = useState<'landing' | 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq' | 'admin-panel'>('landing');
  
  // Secret keyboard shortcut: Ctrl/Cmd + Shift + A = Admin Panel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setCurrentView('admin-panel');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleNavigate = (page: 'landing' | 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq' | 'admin-panel') => {
    setCurrentView(page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarketingPageNavigate = (page: 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq') => {
    handleNavigate(page);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'landing' && (
        <LandingPage 
          onNavigate={(screen: Screen) => {
            if (screen === 'about-us') handleNavigate('about');
            else if (screen === 'blog') handleNavigate('blog');
            else if (screen === 'careers') handleNavigate('careers');
            else if (screen === 'contact') handleNavigate('contact');
            else if (screen === 'videos') handleNavigate('videos');
            else if (screen === 'faq') handleNavigate('faq');
            else if (screen === 'admin-panel') handleNavigate('admin-panel');
            else onStartApp();
          }}
        />
      )}

      {currentView === 'about' && (
        <AboutUs 
          onBack={() => handleNavigate('landing')}
          onGetStarted={onStartApp}
          onNavigate={handleMarketingPageNavigate}
        />
      )}

      {currentView === 'blog' && (
        <BlogPage 
          onBack={() => handleNavigate('landing')}
          onNavigate={handleMarketingPageNavigate}
        />
      )}

      {currentView === 'careers' && (
        <CareersPage 
          onBack={() => handleNavigate('landing')}
          onNavigate={handleMarketingPageNavigate}
        />
      )}

      {currentView === 'contact' && (
        <ContactPage 
          onBack={() => handleNavigate('landing')}
          onNavigate={handleMarketingPageNavigate}
        />
      )}

      {currentView === 'videos' && (
        <VideoPage 
          onBackToHome={() => handleNavigate('landing')}
          onNavigateToFAQ={() => handleNavigate('faq')}
        />
      )}

      {currentView === 'faq' && (
        <FAQPage 
          onBackToHome={() => handleNavigate('landing')}
          onNavigateToVideos={() => handleNavigate('videos')}
        />
      )}

      {currentView === 'admin-panel' && (
        <EnhancedAdminPanel onNavigate={(screen: Screen) => {
          if (screen === 'marketing') {
            handleNavigate('landing');
          }
        }} />
      )}
    </div>
  );
}