import { ArrowLeft, Users, Target, Heart, Award, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MarketingNavBar } from './MarketingNavBar';

interface AboutUsProps {
  onBack?: () => void;
  onGetStarted?: () => void;
  onNavigate?: (page: 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq') => void;
}

export function AboutUs({ onBack, onGetStarted, onNavigate }: AboutUsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation Bar */}
      <MarketingNavBar 
        currentPage="about"
        onBackToHome={onBack || (() => {})}
        onNavigate={onNavigate}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-6xl mb-6">
              Empowering Bharat's Retailers 🇮🇳
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Hum chote retailers ke saathi hain. Hamara mission hai har dukaan ko digital banana - simple, affordable, aur powerful technology ke saath.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8 border-2 border-blue-200">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl mb-4 text-gray-900">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To digitally transform 10 million kirana stores across India by providing them with simple, affordable, and powerful tools that help them compete with big retailers while maintaining their personal touch.
              </p>
            </Card>

            <Card className="p-8 border-2 border-orange-200">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#1E88E5] flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl mb-4 text-gray-900">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                A future where every neighborhood kirana store thrives with technology, where the shopkeeper uncle/aunty can bill faster than any cashier, and where local businesses beat e-commerce in customer service.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              Our Story
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-6 text-gray-900">
              How It All <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Started</span>
            </h2>
          </div>

          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              2023 mein, humne dekha ki thousands of kirana stores struggling kar rahe hain big retailers aur e-commerce ke competition se. Unke paas amazing customer relationships the, lekin technology nahi thi.
            </p>
            <p>
              Hum jaante the ki complex POS systems aur expensive software kirana stores ke liye practical nahi hain. So we decided to build something different - ek app jo bilkul simple ho, Hinglish mein samjhe, aur truly affordable ho.
            </p>
            <p>
              After talking to 500+ retailers across India, we built Retail Bandhu Lite - India's first voice + AI billing app designed specifically for kirana stores. No technical knowledge needed, no expensive hardware, just your smartphone!
            </p>
            <p>
              Aaj, 5000+ retailers use kar rahe hain humara app, aur har din naye retailers join kar rahe hain. This is just the beginning of our journey to digitally transform Bharat's retail ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Core Values
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Believe In</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Customer First',
                description: 'Retailers ki khushi aur success hamari priority hai',
                color: 'from-red-500 to-pink-500'
              },
              {
                icon: Sparkles,
                title: 'Simplicity',
                description: 'Technology simple honi chahiye, complicated nahi',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Globe,
                title: 'Inclusivity',
                description: 'Technology sabke liye accessible honi chahiye',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: TrendingUp,
                title: 'Innovation',
                description: 'Hamesha naye solutions dhoondhte rehna',
                color: 'from-purple-500 to-violet-500'
              }
            ].map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Passionate People</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ek dedicated team jo India ke retailers ko empower karna chahti hai
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Founder & CEO',
                description: 'Ex-Flipkart, 10+ years retail tech experience',
                avatar: '👩‍💼'
              },
              {
                name: 'Rahul Verma',
                role: 'Head of Product',
                description: 'IIT Delhi, Built products for 5M+ users',
                avatar: '👨‍💻'
              },
              {
                name: 'Anjali Patel',
                role: 'Head of Customer Success',
                description: 'Worked with 1000+ retailers personally',
                avatar: '👩‍💼'
              }
            ].map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl mb-1 text-gray-900">{member.name}</h3>
                <p className="text-sm text-orange-600 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '5000+', label: 'Active Retailers' },
              { number: '50L+', label: 'Bills Generated' },
              { number: '28', label: 'Indian States' },
              { number: '4.8/5', label: 'Customer Rating' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-5xl mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl mb-6 text-gray-900">
            Join Our Mission! 🚀
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Help us transform Bharat's retail ecosystem, one kirana at a time
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-lg"
            onClick={onGetStarted}
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
}