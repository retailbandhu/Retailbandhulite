import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Mic,
  MessageSquare,
  Package,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Zap,
  Play,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Bell,
  Gift,
  Calendar,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface FeatureShowcaseProps {
  onTryFeature?: (feature: string) => void;
}

export function FeatureShowcase({ onTryFeature }: FeatureShowcaseProps) {
  const [activeTab, setActiveTab] = useState('voice');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const features = {
    voice: {
      id: 'voice',
      title: 'Voice Billing',
      tagline: 'Bolo aur Bill Ban Gaya',
      icon: Mic,
      color: 'from-blue-500 to-blue-600',
      demo: {
        steps: [
          { icon: Mic, text: 'Press mic button on dashboard', time: '0s' },
          { icon: MessageSquare, text: 'Speak: "2 kg chawal, 1 Maggi"', time: '2s' },
          { icon: Sparkles, text: 'AI recognizes & adds prices', time: '5s' },
          { icon: CheckCircle2, text: 'Complete bill ready!', time: '8s' }
        ],
        benefits: [
          'Works in Hindi, English, Hinglish',
          'Recognizes 10,000+ common products',
          '95% accuracy even with noise',
          'Saves 5 minutes per bill'
        ],
        videoPlaceholder: 'Voice billing in action - Shopkeeper speaking items'
      }
    },
    whatsapp: {
      id: 'whatsapp',
      title: 'WhatsApp Integration',
      tagline: 'Direct Customer Connection',
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      demo: {
        steps: [
          { icon: CheckCircle2, text: 'Bill created successfully', time: '0s' },
          { icon: MessageSquare, text: 'Tap "Share on WhatsApp"', time: '1s' },
          { icon: Users, text: 'Select customer contact', time: '2s' },
          { icon: CheckCircle2, text: 'PDF sent automatically!', time: '3s' }
        ],
        benefits: [
          'No WhatsApp Business API needed',
          'Share bills, catalogs, reminders',
          'Automated payment follow-ups',
          'Bulk message broadcasting'
        ],
        videoPlaceholder: 'WhatsApp bill sharing demo'
      }
    },
    inventory: {
      id: 'inventory',
      title: 'Smart Inventory',
      tagline: 'Never Run Out of Stock',
      icon: Package,
      color: 'from-orange-500 to-orange-600',
      demo: {
        steps: [
          { icon: Package, text: 'Add products with barcode scan', time: '0s' },
          { icon: Bell, text: 'Auto low-stock alerts trigger', time: 'Auto' },
          { icon: BarChart3, text: 'AI suggests reorder quantity', time: 'Auto' },
          { icon: CheckCircle2, text: 'Generate purchase order', time: '1-click' }
        ],
        benefits: [
          'Barcode scanner built-in',
          'Auto inventory deduction on bills',
          'Low stock alerts via WhatsApp',
          'Product expiry tracking'
        ],
        videoPlaceholder: 'Inventory management walkthrough'
      }
    },
    analytics: {
      id: 'analytics',
      title: 'Business Analytics',
      tagline: 'Data-Driven Decisions',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      demo: {
        steps: [
          { icon: BarChart3, text: 'Real-time sales dashboard', time: 'Live' },
          { icon: TrendingUp, text: 'Profit margin analysis', time: 'Daily' },
          { icon: Package, text: 'Top-selling products report', time: 'Weekly' },
          { icon: Calendar, text: 'Month-wise comparison', time: 'Monthly' }
        ],
        benefits: [
          'Beautiful visual charts',
          'Daily/Weekly/Monthly reports',
          'Product performance insights',
          'Customer buying patterns'
        ],
        videoPlaceholder: 'Analytics dashboard tour'
      }
    },
    khata: {
      id: 'khata',
      title: 'Digital Khata',
      tagline: 'Udhar Ka Hisaab Digital',
      icon: Users,
      color: 'from-red-500 to-red-600',
      demo: {
        steps: [
          { icon: CreditCard, text: 'Select "Credit" in payment', time: '0s' },
          { icon: Users, text: 'Customer khata auto-updated', time: 'Auto' },
          { icon: Bell, text: 'Auto reminder on due date', time: 'Auto' },
          { icon: MessageSquare, text: 'WhatsApp reminder sent', time: 'Auto' }
        ],
        benefits: [
          'Digital udhar management',
          'Auto payment reminders',
          'Credit limit per customer',
          'Complete payment history'
        ],
        videoPlaceholder: 'Khata management demo'
      }
    },
    gst: {
      id: 'gst',
      title: 'GST Ready',
      tagline: 'Compliant & Easy',
      icon: Shield,
      color: 'from-indigo-500 to-indigo-600',
      demo: {
        steps: [
          { icon: Package, text: 'Add HSN codes to products', time: 'One-time' },
          { icon: Shield, text: 'Auto GST calculation on bills', time: 'Auto' },
          { icon: BarChart3, text: 'Generate GSTR reports', time: '1-click' },
          { icon: CheckCircle2, text: 'Export for filing', time: '1-click' }
        ],
        benefits: [
          'CGST, SGST, IGST support',
          'HSN code management',
          'GSTR-1, GSTR-3B reports',
          '100% GST compliant'
        ],
        videoPlaceholder: 'GST features walkthrough'
      }
    }
  };

  const activeFeature = features[activeTab as keyof typeof features];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
          Interactive Feature Tour
        </Badge>
        <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Every Feature</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Click each feature to see how it works. Sab features bahut simple aur powerful hain!
        </p>
      </div>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-transparent h-auto">
          {Object.values(features).map((feature) => {
            const Icon = feature.icon;
            return (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-orange-500 data-[state=active]:text-white flex-col h-auto py-4 px-3"
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-sm">{feature.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Feature Content */}
        {Object.values(features).map((feature) => {
          const FeatureIcon = feature.icon;
          
          return (
            <TabsContent key={feature.id} value={feature.id} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Video/Demo Placeholder */}
                <Card className="p-8 bg-gradient-to-br from-gray-50 to-white">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1E88E5]/20 to-[#FF6F00]/20" />
                    <div className="relative z-10 text-center">
                      <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Play className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-gray-700">
                        {feature.demo.videoPlaceholder}
                      </p>
                      <Badge className="mt-3 bg-white/90 text-gray-700">
                        <Zap className="w-3 h-3 mr-1" />
                        2 min demo
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-blue-50 border-blue-200">
                      <div className="text-2xl text-blue-600 mb-1">10 sec</div>
                      <div className="text-xs text-gray-600">Average Time</div>
                    </Card>
                    <Card className="p-3 bg-green-50 border-green-200">
                      <div className="text-2xl text-green-600 mb-1">95%</div>
                      <div className="text-xs text-gray-600">Accuracy Rate</div>
                    </Card>
                  </div>
                </Card>

                {/* Right: Feature Details */}
                <div className="space-y-6">
                  <div>
                    <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} items-center justify-center mb-4`}>
                      <FeatureIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-xl text-orange-600 mb-4">{feature.tagline}</p>
                  </div>

                  {/* How it Works */}
                  <div>
                    <h4 className="text-lg mb-4 text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      How It Works
                    </h4>
                    <div className="space-y-3">
                      {feature.demo.steps.map((step, index) => {
                        const StepIcon = step.icon;
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <StepIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700">{step.text}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {step.time}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div>
                    <h4 className="text-lg mb-4 text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {feature.demo.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                    size="lg"
                    onClick={() => onTryFeature?.(feature.id)}
                  >
                    Try {feature.title} Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Bottom CTA */}
      <Card className="mt-12 p-8 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white text-center">
        <h3 className="text-2xl md:text-3xl mb-4">
          Ready to Experience All Features? 🚀
        </h3>
        <p className="text-lg mb-6 text-white/90">
          Start your free trial and get full access to all premium features for 7 days
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => onTryFeature?.('signup')}
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            onClick={() => onTryFeature?.('contact')}
          >
            Talk to Sales
          </Button>
        </div>
      </Card>
    </div>
  );
}
