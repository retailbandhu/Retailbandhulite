import React from 'react';
import { Button } from './ui/button';
import { VideoDemo } from './VideoDemo';
import { toast } from 'sonner';
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

interface VideoPageProps {
  onBackToHome: () => void;
  onNavigateToFAQ?: () => void;
}

export function VideoPage({ onBackToHome, onNavigateToFAQ }: VideoPageProps) {
  // Main navigation links matching the screenshot exactly
  const navLinks = [
    { id: 'home', label: 'Home', icon: Home, onClick: onBackToHome },
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
    },
    { id: 'videos', label: 'Videos', icon: Play, isActive: true },
    {
      id: 'compare',
      label: 'Compare',
      icon: GitCompare,
      onClick: () => toast.info('📊 Feature comparison coming soon!'),
    },
    {
      id: 'success',
      label: 'Success Stories',
      icon: Trophy,
      onClick: () => toast.info('🏆 Customer success stories coming soon!'),
    },
    {
      id: 'roi',
      label: 'ROI Calculator',
      icon: Calculator,
      onClick: () => toast.info('🧮 ROI calculator coming soon!'),
    },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, onClick: onNavigateToFAQ },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side */}
            <div className="flex items-center gap-6">
              {/* Back to Home */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>

              {/* Divider */}
              <div className="hidden md:block h-6 w-px bg-gray-300" />

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Button
                      key={link.id}
                      variant="ghost"
                      size="sm"
                      onClick={link.onClick}
                      className={link.isActive ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-600 hover:text-gray-900'}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Right Side */}
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] hover:shadow-lg transition-shadow"
              onClick={() => {
                onBackToHome();
                setTimeout(() => window.location.reload(), 100);
              }}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </nav>

      {/* Video Content */}
      <VideoDemo onBackToHome={onBackToHome} />
    </div>
  );
}