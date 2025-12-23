import { ArrowLeft, Check, Zap, Crown, Rocket } from 'lucide-react';
import { Button } from './ui/button';
import { Screen } from '../types';

interface SubscriptionPageProps {
  onNavigate: (screen: Screen) => void;
}

export function SubscriptionPage({ onNavigate }: SubscriptionPageProps) {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: <Zap className="w-8 h-8" />,
      price: '₹0',
      period: 'Forever',
      color: 'from-gray-500 to-gray-600',
      features: [
        'Unlimited bills',
        'Voice billing',
        'WhatsApp bill sharing',
        'Basic inventory',
        'Bill customization',
        'Community support'
      ],
      current: true
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Crown className="w-8 h-8" />,
      price: '₹99',
      period: 'per month',
      color: 'from-[#1E88E5] to-[#FF6F00]',
      popular: true,
      features: [
        'Everything in Free +',
        'Digital product catalog',
        'Advanced reports & analytics',
        'Low stock alerts',
        'Custom bill templates',
        'Priority support',
        'Cloud backup'
      ]
    },
    {
      id: 'automation',
      name: 'Automation',
      icon: <Rocket className="w-8 h-8" />,
      price: '₹199',
      period: 'per month',
      color: 'from-purple-500 to-purple-700',
      features: [
        'Everything in Pro +',
        'WhatsApp automation',
        'Bulk messaging',
        'Message templates',
        'Campaign analytics',
        'Auto payment reminders',
        'Customer segmentation',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Subscription Plans</h1>
          <div className="w-6" />
        </div>
        <p className="text-white/90 text-center">Apne business ke liye sahi plan chunein</p>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-4">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
              plan.popular ? 'ring-2 ring-[#FF6F00]' : ''
            }`}
          >
            {plan.popular && (
              <div className="bg-gradient-to-r from-[#FF6F00] to-orange-600 text-white text-center py-2 text-sm">
                ⭐ Most Popular
              </div>
            )}
            
            <div className="p-6">
              {/* Plan Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900">{plan.name}</h3>
                    {plan.current && (
                      <span className="text-xs text-green-600">Current Plan</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {plan.current ? (
                <Button 
                  disabled
                  variant="outline"
                  className="w-full h-11"
                >
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className={`w-full h-11 bg-gradient-to-r ${plan.color} text-white hover:opacity-90`}
                >
                  Upgrade to {plan.name}
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Testimonials */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
          <h3 className="text-gray-900 mb-3">What Retailers Say 💬</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-700 text-sm mb-2">
                "Pro plan se mera business organized ho gaya. Reports bahut helpful hain!"
              </p>
              <p className="text-gray-600 text-xs">— Rajesh, Delhi</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-700 text-sm mb-2">
                "WhatsApp automation se sales 30% badh gayi. Best investment!"
              </p>
              <p className="text-gray-600 text-xs">— Priya, Mumbai</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-900 mb-1">Can I upgrade anytime?</p>
              <p className="text-gray-600">Haan! Kabhi bhi upgrade ya downgrade kar sakte hain.</p>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-gray-900 mb-1">Payment methods?</p>
              <p className="text-gray-600">UPI, Card, Net Banking — sab accepted hai.</p>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-gray-900 mb-1">Refund policy?</p>
              <p className="text-gray-600">7 days money-back guarantee agar satisfied nahi hain.</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center bg-white rounded-xl shadow-md p-5">
          <p className="text-gray-600 text-sm mb-2">
            Confused about which plan to choose?
          </p>
          <Button variant="outline" className="mx-auto">
            Talk to Bandhu 💬
          </Button>
        </div>
      </div>
    </div>
  );
}