import React from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Home,
  LayoutGrid,
  Play,
  GitCompare,
  Trophy,
  Calculator,
  HelpCircle,
} from 'lucide-react';

interface MarketingNavBarProps {
  currentPage: 'home' | 'features' | 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq' | 'compare' | 'success-stories' | 'roi-calculator';
  onBackToHome: () => void;
  onNavigate?: (page: 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq') => void;
}

export function MarketingNavBar({ currentPage, onBackToHome, onNavigate }: MarketingNavBarProps) {
  // Main navigation links matching the screenshot
  const navLinks = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      onClick: onBackToHome,
      isActive: currentPage === 'home'
    },
    { 
      id: 'features', 
      label: 'Features', 
      icon: LayoutGrid, 
      onClick: () => {
        onBackToHome();
        setTimeout(() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      isActive: currentPage === 'features'
    },
    { 
      id: 'videos', 
      label: 'Videos', 
      icon: Play, 
      onClick: () => onNavigate?.('videos'),
      isActive: currentPage === 'videos'
    },
    { 
      id: 'compare', 
      label: 'Compare', 
      icon: GitCompare, 
      onClick: () => toast.info('📊 Feature comparison coming soon!'),
      isActive: currentPage === 'compare'
    },
    { 
      id: 'success-stories', 
      label: 'Success Stories', 
      icon: Trophy, 
      onClick: () => toast.info('🏆 Customer success stories coming soon!'),
      isActive: currentPage === 'success-stories'
    },
    { 
      id: 'roi-calculator', 
      label: 'ROI Calculator', 
      icon: Calculator, 
      onClick: () => toast.info('🧮 ROI calculator coming soon!'),
      isActive: currentPage === 'roi-calculator'
    },
    { 
      id: 'faq', 
      label: 'FAQ', 
      icon: HelpCircle, 
      onClick: () => onNavigate?.('faq'),
      isActive: currentPage === 'faq'
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Back to Home */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToHome}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>

            {/* Divider */}
            <div className="hidden lg:block h-6 w-px bg-gray-300" />

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                
                return (
                  <Button
                    key={link.id}
                    variant="ghost"
                    size="sm"
                    onClick={link.onClick}
                    className={`${
                      link.isActive
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Button>
                );
              })}
            </div>

            {/* Mobile: Current page indicator */}
            <div className="lg:hidden flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md capitalize">
                {currentPage.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] hover:shadow-lg transition-shadow"
              onClick={() => {
                onBackToHome();
                setTimeout(() => window.location.reload(), 100);
              }}
            >
              <span className="hidden sm:inline">Start Free Trial</span>
              <span className="sm:hidden">Try Free</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}