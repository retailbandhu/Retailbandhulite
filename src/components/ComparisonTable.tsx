import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, X, Sparkles, Zap, Crown } from 'lucide-react';

interface ComparisonTableProps {
  onSelectPlan?: (plan: string) => void;
}

export function ComparisonTable({ onSelectPlan }: ComparisonTableProps) {
  const features = [
    {
      category: 'Billing Features',
      items: [
        { name: 'Manual billing', free: true, pro: true, automation: true },
        { name: 'Voice billing', free: false, pro: true, automation: true },
        { name: 'Bills per month', free: '100', pro: 'Unlimited', automation: 'Unlimited' },
        { name: 'Bill customization', free: 'Basic', pro: 'Advanced', automation: 'Advanced' },
        { name: 'Multiple payment methods', free: true, pro: true, automation: true },
        { name: 'Barcode scanning', free: false, pro: true, automation: true }
      ]
    },
    {
      category: 'Inventory Management',
      items: [
        { name: 'Basic inventory', free: true, pro: true, automation: true },
        { name: 'Low stock alerts', free: false, pro: true, automation: true },
        { name: 'Auto reorder suggestions', free: false, pro: false, automation: true },
        { name: 'Expiry tracking', free: false, pro: true, automation: true },
        { name: 'Product categories', free: 'Limited', pro: 'Unlimited', automation: 'Unlimited' },
        { name: 'Supplier management', free: false, pro: true, automation: true }
      ]
    },
    {
      category: 'WhatsApp Integration',
      items: [
        { name: 'Manual bill sharing', free: true, pro: true, automation: true },
        { name: 'Catalog sharing', free: false, pro: true, automation: true },
        { name: 'Auto payment reminders', free: false, pro: false, automation: true },
        { name: 'Bulk messaging', free: false, pro: false, automation: true },
        { name: 'Automated follow-ups', free: false, pro: false, automation: true },
        { name: 'Custom message templates', free: false, pro: true, automation: true }
      ]
    },
    {
      category: 'Reports & Analytics',
      items: [
        { name: 'Sales reports', free: 'Basic', pro: 'Advanced', automation: 'Advanced + AI' },
        { name: 'Profit analysis', free: false, pro: true, automation: true },
        { name: 'Product performance', free: false, pro: true, automation: true },
        { name: 'Customer insights', free: false, pro: true, automation: true },
        { name: 'Predictive analytics', free: false, pro: false, automation: true },
        { name: 'Export reports', free: false, pro: true, automation: true }
      ]
    },
    {
      category: 'Customer Management',
      items: [
        { name: 'Customer database', free: 'Limited', pro: 'Unlimited', automation: 'Unlimited' },
        { name: 'Digital khata', free: false, pro: true, automation: true },
        { name: 'Credit management', free: false, pro: true, automation: true },
        { name: 'Loyalty program', free: false, pro: true, automation: true },
        { name: 'Customer segmentation', free: false, pro: false, automation: true },
        { name: 'Purchase history', free: false, pro: true, automation: true }
      ]
    },
    {
      category: 'GST & Compliance',
      items: [
        { name: 'GST calculations', free: true, pro: true, automation: true },
        { name: 'GSTR reports', free: false, pro: true, automation: true },
        { name: 'HSN code management', free: false, pro: true, automation: true },
        { name: 'Invoice compliance', free: 'Basic', pro: 'Full', automation: 'Full' },
        { name: 'Tax filing support', free: false, pro: true, automation: true }
      ]
    },
    {
      category: 'Support & Extras',
      items: [
        { name: 'Number of users', free: '1', pro: '3', automation: 'Unlimited' },
        { name: 'Data backup', free: 'Manual', pro: 'Auto daily', automation: 'Real-time' },
        { name: 'Support', free: 'Email', pro: 'WhatsApp', automation: 'Priority 24/7' },
        { name: 'Training videos', free: true, pro: true, automation: true },
        { name: 'Custom branding', free: false, pro: false, automation: true },
        { name: 'API access', free: false, pro: false, automation: true }
      ]
    }
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
          Feature Comparison
        </Badge>
        <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
          Compare All <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Plans</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dekho exactly kya milega har plan mein. Complete transparency!
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Plan Headers */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div /> {/* Empty for feature column */}
            
            {/* Free Plan */}
            <Card className="p-6 text-center border-2 border-gray-200">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-gray-600" />
              <h3 className="text-xl mb-1 text-gray-900">Free</h3>
              <p className="text-sm text-gray-600 mb-3">Shuru Karein</p>
              <div className="text-3xl mb-1 text-gray-900">₹0</div>
              <p className="text-sm text-gray-600 mb-4">Forever</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onSelectPlan?.('free')}
              >
                Start Free
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="p-6 text-center border-2 border-blue-500 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">
                Most Popular
              </Badge>
              <Zap className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="text-xl mb-1 text-gray-900">Pro</h3>
              <p className="text-sm text-gray-600 mb-3">Best Value</p>
              <div className="text-3xl mb-1 text-gray-900">₹299</div>
              <p className="text-sm text-gray-600 mb-4">/month</p>
              <Button 
                className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                onClick={() => onSelectPlan?.('pro')}
              >
                Start Trial
              </Button>
            </Card>

            {/* Automation Plan */}
            <Card className="p-6 text-center border-2 border-orange-500">
              <Crown className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <h3 className="text-xl mb-1 text-gray-900">Automation</h3>
              <p className="text-sm text-gray-600 mb-3">Full Power</p>
              <div className="text-3xl mb-1 text-gray-900">₹599</div>
              <p className="text-sm text-gray-600 mb-4">/month</p>
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                onClick={() => onSelectPlan?.('automation')}
              >
                Start Trial
              </Button>
            </Card>
          </div>

          {/* Feature Rows */}
          <div className="space-y-8">
            {features.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="text-lg mb-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg text-gray-900">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="grid grid-cols-4 gap-4 items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="text-sm text-gray-700">{item.name}</div>
                      <div className="text-center">{renderCell(item.free)}</div>
                      <div className="text-center">{renderCell(item.pro)}</div>
                      <div className="text-center">{renderCell(item.automation)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white text-center">
            <h3 className="text-2xl mb-3">Still Confused? 🤔</h3>
            <p className="text-lg mb-6 text-white/90">
              Humse baat karein - we'll help you choose the perfect plan!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Talk to Sales
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Schedule Demo Call
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl mb-8 text-center text-gray-900">
          Common Questions About Plans
        </h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              q: 'Can I upgrade or downgrade anytime?',
              a: 'Yes! You can change your plan anytime. Upgrade instantly, downgrade at end of billing cycle.'
            },
            {
              q: 'What happens after free trial?',
              a: 'Your card won\'t be charged. You can continue with Free plan or upgrade to Pro/Automation.'
            },
            {
              q: 'Is there a setup fee?',
              a: 'No setup fees! Pay only the monthly subscription. Cancel anytime, no questions asked.'
            },
            {
              q: 'Can I get a refund?',
              a: '7-day money-back guarantee. If not satisfied, we\'ll refund 100% - no questions asked!'
            }
          ].map((faq, index) => (
            <Card key={index} className="p-6">
              <h4 className="mb-2 text-gray-900">{faq.q}</h4>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
