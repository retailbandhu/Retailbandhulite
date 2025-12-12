import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { SocialProof } from './SocialProof';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { toast } from 'sonner';
import { useLandingPageContent } from '../hooks/useAdminContent';
import { Screen } from '../App';
import bandhuMascot from 'figma:asset/4d93b3d1b087e58174e0c66cc9a52e892bfab633.png';
import { 
  Mic, 
  MessageSquare, 
  Package, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe, 
  Smartphone,
  CheckCircle2,
  Star,
  ArrowRight,
  Play,
  Download,
  Users,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (screen: Screen) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [activePlan, setActivePlan] = useState<'free' | 'pro' | 'automation'>('pro');
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const { content, loading } = useLandingPageContent();

  const handleGetStarted = () => onNavigate('splash');
  const handleWatchDemo = () => onNavigate('videos');
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={bandhuMascot} 
                alt="Retail Bandhu Lite Logo" 
                className="w-10 h-10 rounded-xl"
              />
              <div>
                <h1 className="font-bold text-gray-900">Retail Bandhu Lite</h1>
                <p className="text-xs text-gray-600">Aapka Digital Dukaan Saathi</p>
              </div>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Reviews
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleLogin}>Login</Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] hover:shadow-lg transition-shadow"
                onClick={handleGetStarted}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Billing
            </Badge>
            <h1 className="text-4xl md:text-6xl tracking-tight text-gray-900">
              Bolo aur Bill
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">
                Ban Gaya! 🎤
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              India's first Voice + AI billing app for kirana stores. 
              <strong className="text-gray-900"> Just speak</strong> - bill automatically WhatsApp par chala jayega!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-lg"
                onClick={handleGetStarted}
              >
                <Download className="w-5 h-5 mr-2" />
                Start Free - No Credit Card
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleWatchDemo}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo (2 min)
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-orange-400 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-gray-600">5000+ retailers trust us</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="aspect-[9/16] bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Mic className="w-20 h-20 mx-auto mb-4 animate-pulse" />
                  <p className="text-2xl mb-2">🎤 Voice Billing Demo</p>
                  <p className="text-white/80">Tap to see it in action</p>
                </div>
              </div>
            </div>
            {/* Floating Stats */}
            <Card className="absolute -bottom-6 -left-6 p-4 shadow-xl bg-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl">10 sec</p>
                  <p className="text-sm text-gray-600">Per Bill</p>
                </div>
              </div>
            </Card>
            <Card className="absolute -top-6 -right-6 p-4 shadow-xl bg-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl">5000+</p>
                  <p className="text-sm text-gray-600">Happy Users</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              Poora Package
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              Ek App Mein <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Sab Kuch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From voice billing to inventory management - everything you need to run your kirana digitally
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: 'Voice Billing',
                subtitle: 'Bolo aur Bill Bano',
                description: 'Just speak product names - AI creates complete bill with prices. Works in Hindi, English, or Hinglish!',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: MessageSquare,
                title: 'WhatsApp Integration',
                subtitle: 'Seedha Customer Ko',
                description: 'Share bills, catalogs, and payment reminders directly on WhatsApp. Automated follow-ups bhi!',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Package,
                title: 'Smart Inventory',
                subtitle: 'Stock Hamesha Control Mein',
                description: 'Auto low-stock alerts, barcode scanning, and purchase order generation. Never run out of stock!',
                color: 'from-orange-500 to-orange-600'
              },
              {
                icon: TrendingUp,
                title: 'Business Analytics',
                subtitle: 'Data Se Growth',
                description: 'Daily sales reports, profit margins, best-selling products. Make decisions based on data!',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Users,
                title: 'Khata Management',
                subtitle: 'Udhar Ka Hisaab',
                description: 'Digital khata for credit customers. Auto reminders via WhatsApp. No more diary hassle!',
                color: 'from-red-500 to-red-600'
              },
              {
                icon: Shield,
                title: 'GST Ready',
                subtitle: 'GST Filing Asaan',
                description: 'Auto GST calculations, GSTR reports, and HSN code management. Completely compliant!',
                color: 'from-indigo-500 to-indigo-600'
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-200 group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl mb-1 text-gray-900">{feature.title}</h3>
                <p className="text-sm text-orange-600 mb-3">{feature.subtitle}</p>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              3 Simple Steps
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              Kaise Kaam Karta Hai?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Install & Setup',
                description: 'Download app, add your shop details in 2 minutes. Free forever plan available!',
                icon: Download
              },
              {
                step: '2',
                title: 'Start Billing',
                description: 'Press mic button, speak items. "2 kg chawal, 1 Maggi packet" - done!',
                icon: Mic
              },
              {
                step: '3',
                title: 'Share on WhatsApp',
                description: 'Tap share, select customer, bill automatically sent on WhatsApp!',
                icon: MessageSquare
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] text-white text-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <step.icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-10 -right-8 w-8 h-8 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
              Affordable Plans
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Plan</span>
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade anytime. No hidden charges!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                id: 'free',
                name: 'Free',
                price: '₹0',
                period: 'Forever',
                subtitle: 'Shuru Karne Ke Liye',
                features: [
                  '100 bills/month',
                  'Basic inventory',
                  'WhatsApp sharing',
                  'Simple reports',
                  'Single user'
                ],
                cta: 'Start Free',
                popular: false
              },
              {
                id: 'pro',
                name: 'Pro',
                price: '₹299',
                period: '/month',
                subtitle: 'Sabse Popular',
                features: [
                  'Unlimited bills',
                  'Voice billing',
                  'Advanced inventory',
                  'GST ready',
                  'Khata management',
                  'Business analytics',
                  '3 users'
                ],
                cta: 'Start 7-Day Trial',
                popular: true
              },
              {
                id: 'automation',
                name: 'Automation',
                price: '₹599',
                period: '/month',
                subtitle: 'Full Automation',
                features: [
                  'Everything in Pro',
                  'WhatsApp automation',
                  'Auto payment reminders',
                  'Catalog broadcasting',
                  'AI insights',
                  'Priority support',
                  'Unlimited users'
                ],
                cta: 'Start 7-Day Trial',
                popular: false
              }
            ].map((plan) => (
              <Card 
                key={plan.id}
                className={`p-8 relative ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-2xl scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl mb-1 text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>
                <Button 
                  className={`w-full mb-6 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={handleGetStarted}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-blue-50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 mb-4">
              Customer Love
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              Retailers Kya Kehte Hain?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ramesh Verma',
                shop: 'Verma Kirana Store, Delhi',
                text: 'Pehle bill banane mein 5 minute lagta tha, ab sirf 10 second! Voice billing is a game changer. Customers bhi impressed hain.',
                rating: 5
              },
              {
                name: 'Priya Patel',
                shop: 'Patel General Store, Mumbai',
                text: 'WhatsApp automation se sales 30% badh gayi. Customers ko reminders automatically jati hain. Bahut time save hota hai!',
                rating: 5
              },
              {
                name: 'Suresh Kumar',
                shop: 'Kumar Provision Store, Bangalore',
                text: 'GST filing ab bahut easy ho gaya. Ek click mein reports ready. Free plan se start kiya tha, ab Pro user hoon!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-1 mb-4 text-yellow-500">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-orange-400" />
                  <div>
                    <p className="text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.shop}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl mb-6">
            Ready to Transform Your Kirana? 🚀
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join 5000+ retailers already using Retail Bandhu Lite. 
            Start your 7-day free trial today - no credit card required!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={handleGetStarted}
            >
              <Download className="w-5 h-5 mr-2" />
              Start Free Trial Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              onClick={handleWatchDemo}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo First
            </Button>
          </div>
          <p className="mt-6 text-white/80 text-sm">
            ✓ 7-day free trial ✓ No credit card ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={bandhuMascot} 
                  alt="Retail Bandhu Lite Logo" 
                  className="w-10 h-10 rounded-xl"
                />
                <div>
                  <h3 className="text-lg">Retail Bandhu Lite</h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                India's #1 Voice + AI billing app for kirana stores
              </p>
            </div>
            <div>
              <h4 className="mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate?.('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => window.scrollTo({ top: document.getElementById('pricing')?.offsetTop || 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={handleWatchDemo} className="hover:text-white transition-colors">Demo</button></li>
                <li><button onClick={() => toast.info('🚀 Updates coming soon! Follow us for latest features.')} className="hover:text-white transition-colors">Updates</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate?.('faq')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => onNavigate?.('videos')} className="hover:text-white transition-colors">Video Tutorials</button></li>
                <li><button onClick={() => { window.open('https://wa.me/919876543210?text=Hi%20Retail%20Bandhu%20Team!%20I%20need%20help.', '_blank'); toast.success('Opening WhatsApp...'); }} className="hover:text-white transition-colors">WhatsApp Support</button></li>
                <li><button onClick={() => toast.info('💬 Community launching soon! Join 5000+ retailers.')} className="hover:text-white transition-colors">Community</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate?.('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => onNavigate?.('blog')} className="hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => onNavigate?.('careers')} className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => onNavigate?.('contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">© 2024 Retail Bandhu Lite. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-white transition text-sm">
                  Privacy Policy
                </button>
                <button className="text-gray-400 hover:text-white transition text-sm">
                  Terms of Service
                </button>
                <button 
                  onClick={() => onNavigate('admin-panel')}
                  className="text-gray-700 hover:text-gray-400 transition text-xs opacity-30 hover:opacity-100"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}