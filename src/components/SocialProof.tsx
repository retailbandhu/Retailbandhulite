import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { 
  TrendingUp,
  Users,
  Star,
  MapPin,
  Store,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';

export function SocialProof() {
  const [liveActivity, setLiveActivity] = useState(0);

  // Simulate live activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity(Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const recentSignups = [
    { name: 'Rajesh Kumar', location: 'Delhi', time: '2 min ago' },
    { name: 'Priya Sharma', location: 'Mumbai', time: '5 min ago' },
    { name: 'Amit Patel', location: 'Ahmedabad', time: '8 min ago' },
    { name: 'Sunita Verma', location: 'Bangalore', time: '12 min ago' },
    { name: 'Ramesh Singh', location: 'Pune', time: '15 min ago' }
  ];

  const liveStats = [
    { value: '5,247', label: 'Active Stores', icon: Store, trend: '+142 today' },
    { value: '₹2.5Cr', label: 'Monthly GMV', icon: TrendingUp, trend: '+18% MoM' },
    { value: '847K', label: 'Bills This Month', icon: Zap, trend: '+23% vs last month' },
    { value: '4.8★', label: 'Average Rating', icon: Star, trend: '1,240 reviews' }
  ];

  const trustBadges = [
    { icon: '🔒', title: 'Bank-Grade Security', subtitle: 'SSL Encrypted' },
    { icon: '✅', title: 'GST Compliant', subtitle: 'CA Verified' },
    { icon: '🏆', title: 'Award Winning', subtitle: 'Best Retail App 2024' },
    { icon: '🇮🇳', title: 'Made in India', subtitle: 'Supporting Local' }
  ];

  const cityStats = [
    { city: 'Delhi NCR', stores: '1,240', growth: '+15%' },
    { city: 'Mumbai', stores: '980', growth: '+22%' },
    { city: 'Bangalore', stores: '760', growth: '+28%' },
    { city: 'Pune', stores: '520', growth: '+19%' },
    { city: 'Ahmedabad', stores: '430', growth: '+25%' },
    { city: 'Hyderabad', stores: '380', growth: '+31%' }
  ];

  const testimonialHighlights = [
    {
      quote: 'Game changer!',
      author: 'Ramesh V.',
      rating: 5,
      verified: true
    },
    {
      quote: 'Sales 30% badh gayi',
      author: 'Priya P.',
      rating: 5,
      verified: true
    },
    {
      quote: 'Best billing app',
      author: 'Suresh K.',
      rating: 5,
      verified: true
    },
    {
      quote: 'Voice feature is amazing',
      author: 'Amit S.',
      rating: 5,
      verified: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Live Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {liveStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-blue-600" />
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
              <div className="text-2xl mb-1 text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Recent Signups
          </h3>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            Live
          </Badge>
        </div>
        <div className="space-y-3">
          {recentSignups.slice(0, 3).map((signup, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                index === liveActivity ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-orange-400 flex items-center justify-center text-white">
                {signup.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{signup.name}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {signup.location}
                </p>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {signup.time}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-gray-500 mt-4">
          Join 5000+ retailers who started this month
        </p>
      </Card>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustBadges.map((badge, index) => (
          <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="text-sm mb-1 text-gray-900">{badge.title}</div>
            <div className="text-xs text-gray-600">{badge.subtitle}</div>
          </Card>
        ))}
      </div>

      {/* City Presence */}
      <Card className="p-6">
        <h3 className="text-lg mb-4 text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Active in 50+ Cities
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {cityStats.map((city, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-900">{city.city}</p>
                <p className="text-sm text-gray-600">{city.stores} stores</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {city.growth}
              </Badge>
            </div>
          ))}
        </div>
        <p className="text-sm text-center text-gray-600 mt-4">
          Growing presence across India • New cities added weekly
        </p>
      </Card>

      {/* Quick Testimonials */}
      <div className="grid md:grid-cols-4 gap-4">
        {testimonialHighlights.map((testimonial, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-1 mb-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-2 italic">"{testimonial.quote}"</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">{testimonial.author}</p>
              {testimonial.verified && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                  Verified
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Media Mentions */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200">
        <h3 className="text-center mb-6 text-gray-900">As Featured In</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['TechCrunch', 'YourStory', 'Inc42', 'Economic Times'].map((media, index) => (
            <div key={index} className="text-center">
              <div className="h-12 bg-white rounded-lg flex items-center justify-center mb-2">
                <span className="text-gray-600">{media}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-center text-gray-600 mt-4">
          Featured in 20+ publications • Recognized as India's #1 Retail Tech
        </p>
      </Card>
    </div>
  );
}
