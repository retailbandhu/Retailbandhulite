import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

const MarketingHub = lazy(() => import('../components/MarketingHub').then(m => ({ default: m.MarketingHub })));
const AboutUs = lazy(() => import('../components/AboutUs').then(m => ({ default: m.AboutUs })));
const BlogPage = lazy(() => import('../components/BlogPage').then(m => ({ default: m.BlogPage })));
const CareersPage = lazy(() => import('../components/CareersPage').then(m => ({ default: m.CareersPage })));
const ContactPage = lazy(() => import('../components/ContactPage').then(m => ({ default: m.ContactPage })));
const VideoPage = lazy(() => import('../components/VideoPage').then(m => ({ default: m.VideoPage })));
const FAQPage = lazy(() => import('../components/FAQPage').then(m => ({ default: m.FAQPage })));

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

interface LandingRoutesProps {
  onStartApp: () => void;
}

export function LandingRoutes({ onStartApp }: LandingRoutesProps) {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    if (page === 'about') navigate('/about');
    else if (page === 'blog') navigate('/blog');
    else if (page === 'careers') navigate('/careers');
    else if (page === 'contact') navigate('/contact');
    else if (page === 'videos') navigate('/videos');
    else if (page === 'faq') navigate('/faq');
    else if (page === 'landing') navigate('/');
  };
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<MarketingHub onStartApp={onStartApp} />} />
        <Route path="/about" element={<AboutUs onNavigate={handleNavigate} onBack={() => navigate('/')} onGetStarted={onStartApp} />} />
        <Route path="/blog" element={<BlogPage onNavigate={handleNavigate} onBack={() => navigate('/')} />} />
        <Route path="/careers" element={<CareersPage onNavigate={handleNavigate} onBack={() => navigate('/')} />} />
        <Route path="/contact" element={<ContactPage onNavigate={handleNavigate} onBack={() => navigate('/')} />} />
        <Route path="/videos" element={<VideoPage onBackToHome={() => navigate('/')} onNavigateToFAQ={() => navigate('/faq')} />} />
        <Route path="/faq" element={<FAQPage onBackToHome={() => navigate('/')} onNavigateToVideos={() => navigate('/videos')} />} />
      </Routes>
    </Suspense>
  );
}
