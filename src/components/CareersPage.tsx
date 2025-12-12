import { ArrowLeft, Briefcase, Heart, Users, Zap, Sparkles, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MarketingNavBar } from './MarketingNavBar';

interface CareersPageProps {
  onBack?: () => void;
  onApply?: () => void;
  onNavigate?: (page: 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq') => void;
}

export function CareersPage({ onBack, onApply, onNavigate }: CareersPageProps) {
  const openPositions = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Bangalore / Remote',
      type: 'Full-time',
      experience: '3-5 years',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Bangalore / Remote',
      type: 'Full-time',
      experience: '4-6 years',
      skills: ['Product Strategy', 'User Research', 'Analytics', 'Agile'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-4 years',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Delhi / Mumbai',
      type: 'Full-time',
      experience: '2-4 years',
      skills: ['Customer Support', 'Hindi/English', 'Problem Solving', 'Communication'],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Content Writer (Hindi/English)',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      experience: '1-3 years',
      skills: ['Content Writing', 'SEO', 'Hinglish', 'Storytelling'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Business Development Executive',
      department: 'Sales',
      location: 'Multiple Cities',
      type: 'Full-time',
      experience: '1-3 years',
      skills: ['B2B Sales', 'Retail Knowledge', 'Networking', 'Hindi/English'],
      color: 'from-red-500 to-red-600'
    }
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Salary',
      description: 'Industry-leading compensation with ESOPs for all employees'
    },
    {
      icon: '🏥',
      title: 'Health Insurance',
      description: 'Comprehensive health coverage for you and your family'
    },
    {
      icon: '🏖️',
      title: 'Flexible Time Off',
      description: 'Unlimited leave policy - trust-based, no questions asked'
    },
    {
      icon: '🏠',
      title: 'Work From Anywhere',
      description: 'Remote-first culture - work from home, cafe, or mountains'
    },
    {
      icon: '📚',
      title: 'Learning Budget',
      description: '₹50,000 annual budget for courses, books, and conferences'
    },
    {
      icon: '🚀',
      title: 'Fast Growth',
      description: 'Rapid career progression based on impact, not tenure'
    },
    {
      icon: '💻',
      title: 'Latest Tech',
      description: 'MacBook/ThinkPad of your choice + all tools you need'
    },
    {
      icon: '🎉',
      title: 'Team Offsites',
      description: 'Quarterly team retreats to amazing destinations'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer Obsession',
      description: 'Retailers ki khushi hi hamari khushi hai'
    },
    {
      icon: Zap,
      title: 'Move Fast',
      description: 'Speed matters, but quality matters more'
    },
    {
      icon: Users,
      title: 'Team First',
      description: 'We win together, we lose together'
    },
    {
      icon: Sparkles,
      title: 'Think Different',
      description: 'Challenge status quo, innovate fearlessly'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation Bar */}
      <MarketingNavBar 
        currentPage="careers"
        onBackToHome={onBack || (() => {})}
        onNavigate={onNavigate}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Briefcase className="w-3 h-3 mr-1" />
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-6xl mb-6">
              Build the Future of Retail 🚀
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Join a mission-driven team transforming 10 million kirana stores across India. Work on products that matter, with people who care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Open Positions
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Life at Retail Bandhu
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '25+', label: 'Team Members' },
              { number: '6', label: 'Open Positions' },
              { number: '4.9/5', label: 'Glassdoor Rating' },
              { number: '₹10Cr+', label: 'Funding Raised' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl mb-2 text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              Why Retail Bandhu?
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              Work That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Matters</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Not just another tech job - this is a chance to impact millions of lives
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Perks & Benefits
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              We Take Care of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Our People</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-blue-50" id="open-positions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
              We're Hiring!
            </Badge>
            <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
              Open <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Positions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Find your perfect role and join our mission
            </p>
          </div>

          <div className="space-y-4">
            {openPositions.map((job, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.color} flex items-center justify-center`}>
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.department}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {job.experience}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button 
                      className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] w-full md:w-auto"
                      onClick={onApply}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Don't See Your Role */}
          <Card className="mt-8 p-8 text-center bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200">
            <h3 className="text-2xl mb-3 text-gray-900">
              Don't See Your Role? 🤔
            </h3>
            <p className="text-gray-600 mb-6">
              We're always looking for talented people. Send us your resume anyway - we'd love to chat!
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
              onClick={onApply}
            >
              Send Your Resume
            </Button>
          </Card>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
            Launching Soon
          </Badge>
          <h3 className="text-2xl mb-3 text-gray-900">
            Careers Page Coming Soon! 🚀
          </h3>
          <p className="text-gray-600 mb-6">
            We're setting up our careers portal with detailed JDs, culture videos, and easy application process. Stay tuned!
          </p>
          <p className="text-sm text-gray-500">
            For immediate opportunities, email us at: <strong>careers@retailbandhu.com</strong>
          </p>
        </div>
      </section>
    </div>
  );
}