import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign,
  Quote,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface SuccessStoriesProps {
  onReadMore?: (storyId: string) => void;
}

export function SuccessStories({ onReadMore }: SuccessStoriesProps) {
  const stories = [
    {
      id: 'verma-kirana',
      shopName: 'Verma Kirana Store',
      owner: 'Ramesh Verma',
      location: 'Karol Bagh, Delhi',
      image: 'Store owner photo',
      quote: 'Pehle din mein 50+ bills lagane mein 4 ghante lagte the. Ab voice billing se sirf 1 ghanta! Customers bhi bahut khush hain.',
      results: [
        { label: 'Time Saved', value: '75%', icon: Clock, color: 'text-blue-600' },
        { label: 'Revenue Growth', value: '₹45K/mo', icon: DollarSign, color: 'text-green-600' },
        { label: 'Customer Base', value: '+120', icon: Users, color: 'text-purple-600' },
        { label: 'Bills/Day', value: '80+', icon: TrendingUp, color: 'text-orange-600' }
      ],
      story: 'Started with Free plan in March 2024, upgraded to Pro within 2 weeks. Now running automation plan with 3 staff members using the app.',
      beforeAfter: {
        before: ['Manual billing took 5 min/bill', 'Lost sales due to billing queue', 'No proper inventory tracking', 'Forgot to collect udhar'],
        after: ['Voice billing in 30 seconds', '3x faster checkout', 'Auto low-stock alerts', 'Digital khata with reminders']
      }
    },
    {
      id: 'patel-general',
      shopName: 'Patel General Store',
      owner: 'Priya Patel',
      location: 'Andheri, Mumbai',
      image: 'Store owner photo',
      quote: 'WhatsApp automation ne meri life badal di! Morning mein automatic good morning message jaata hai customers ko. Sales 30% badh gayi!',
      results: [
        { label: 'Sales Increase', value: '+30%', icon: TrendingUp, color: 'text-green-600' },
        { label: 'Repeat Customers', value: '85%', icon: Users, color: 'text-purple-600' },
        { label: 'WhatsApp Orders', value: '40/day', icon: DollarSign, color: 'text-blue-600' },
        { label: 'Customer Rating', value: '4.9★', icon: Star, color: 'text-yellow-600' }
      ],
      story: 'Single mother managing store with one helper. Automation features helped her manage everything efficiently while taking care of her kids.',
      beforeAfter: {
        before: ['Manually calling customers', 'Writing bills by hand', 'Forgetting payment dates', 'No marketing'],
        after: ['Auto WhatsApp broadcasts', 'Digital bills on WhatsApp', 'Auto payment reminders', 'Catalog sharing to 500+ customers']
      }
    },
    {
      id: 'kumar-provision',
      shopName: 'Kumar Provision Store',
      owner: 'Suresh Kumar',
      location: 'Indiranagar, Bangalore',
      image: 'Store owner photo',
      quote: 'GST filing ke liye CA ko ₹5000 deta tha. Ab app se khud reports nikalta hoon. Bahut paisa bach gaya!',
      results: [
        { label: 'Monthly Savings', value: '₹5K', icon: DollarSign, color: 'text-green-600' },
        { label: 'Inventory Accuracy', value: '98%', icon: CheckCircle2, color: 'text-blue-600' },
        { label: 'Time on Reports', value: '5 min', icon: Clock, color: 'text-orange-600' },
        { label: 'Products Tracked', value: '1200+', icon: TrendingUp, color: 'text-purple-600' }
      ],
      story: 'Tech-savvy retailer who wanted complete control. Uses advanced features like barcode scanner, GST reports, and inventory predictions.',
      beforeAfter: {
        before: ['Paying CA for GST', 'Excel inventory tracking', 'Manual stock counting', 'No business insights'],
        after: ['Self-service GST reports', 'Auto inventory sync', 'Barcode-based counting', 'AI business suggestions']
      }
    }
  ];

  const stats = [
    { number: '5000+', label: 'Active Retailers', icon: Users },
    { number: '₹2.5Cr+', label: 'Monthly GMV', icon: DollarSign },
    { number: '4.8★', label: 'Average Rating', icon: Star },
    { number: '92%', label: 'Retention Rate', icon: TrendingUp }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Real Success Stories
        </Badge>
        <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
          Retailers Who Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Winning</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Asli dukandaaron ki asli kahaniyan. See how they transformed their business with Retail Bandhu
        </p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 text-center border-2 border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
              <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl mb-1 text-gray-900">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Success Stories */}
      <div className="space-y-12">
        {stories.map((story, index) => (
          <Card key={story.id} className="overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Left: Story Details */}
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-orange-400 flex items-center justify-center text-white text-2xl">
                      {story.owner.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl text-gray-900">{story.owner}</h3>
                      <p className="text-gray-600">{story.shopName}</p>
                      <p className="text-sm text-gray-500">{story.location}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200 relative">
                    <Quote className="absolute top-2 left-2 w-6 h-6 text-blue-300" />
                    <p className="text-gray-700 italic pl-6">{story.quote}</p>
                  </Card>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {story.results.map((result, i) => {
                    const ResultIcon = result.icon;
                    return (
                      <Card key={i} className="p-4 border-2 border-gray-100">
                        <ResultIcon className={`w-5 h-5 mb-2 ${result.color}`} />
                        <div className={`text-2xl mb-1 ${result.color}`}>
                          {result.value}
                        </div>
                        <div className="text-xs text-gray-600">{result.label}</div>
                      </Card>
                    );
                  })}
                </div>

                {/* Story */}
                <div>
                  <h4 className="text-lg mb-2 text-gray-900">Journey</h4>
                  <p className="text-gray-600">{story.story}</p>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                  onClick={() => onReadMore?.(story.id)}
                >
                  Read Full Case Study
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Right: Before/After */}
              <div className="space-y-4">
                <h4 className="text-lg text-gray-900">Transformation</h4>
                
                {/* Before */}
                <Card className="p-6 bg-red-50 border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      ✗
                    </div>
                    <h5 className="text-red-900">Before Retail Bandhu</h5>
                  </div>
                  <ul className="space-y-2">
                    {story.beforeAfter.before.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* After */}
                <Card className="p-6 bg-green-50 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <h5 className="text-green-900">After Retail Bandhu</h5>
                  </div>
                  <ul className="space-y-2">
                    {story.beforeAfter.after.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Time Badge */}
                <Badge className="w-full justify-center bg-gradient-to-r from-blue-100 to-orange-100 text-gray-700 border-blue-200 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Results achieved in 2-3 months
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card className="mt-16 p-8 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white text-center">
        <h3 className="text-2xl md:text-3xl mb-4">
          Aapki Success Story Next! 🚀
        </h3>
        <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
          Join 5000+ retailers who transformed their kirana stores. Your success story could be featured here!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            Talk to Our Retailers
          </Button>
        </div>
      </Card>
    </div>
  );
}
