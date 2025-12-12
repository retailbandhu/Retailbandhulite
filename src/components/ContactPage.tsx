import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';
import { MarketingNavBar } from './MarketingNavBar';

interface ContactPageProps {
  onBack?: () => void;
  onNavigate?: (page: 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq') => void;
}

export function ContactPage({ onBack, onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours. 📧');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation Bar */}
      <MarketingNavBar 
        currentPage="contact"
        onBackToHome={onBack || (() => {})}
        onNavigate={onNavigate}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <MessageSquare className="w-3 h-3 mr-1" />
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl mb-6">
              We'd Love to Hear From You! 💬
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Questions? Feedback? Partnership ideas? Just want to say hi? Reach out - we're here to help!
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl mb-6 text-gray-900">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ramesh Kumar"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Your Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="p-6">
              <h3 className="text-xl mb-6 text-gray-900">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">WhatsApp Support</h4>
                    <p className="text-gray-600 text-sm mb-2">Fastest way to reach us</p>
                    <button
                      onClick={() => {
                        window.open('https://wa.me/919876543210?text=Hi%20Retail%20Bandhu%20Team!', '_blank');
                        toast.success('Opening WhatsApp...');
                      }}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      +91 98765 43210
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600 text-sm mb-2">We reply within 24 hours</p>
                    <a href="mailto:support@retailbandhu.com" className="text-blue-600 hover:text-blue-700 text-sm">
                      support@retailbandhu.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600 text-sm mb-2">Mon-Sat, 9 AM - 7 PM</p>
                    <a href="tel:+918800123456" className="text-blue-600 hover:text-blue-700 text-sm">
                      1800-123-4567 (Toll Free)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Office</h4>
                    <p className="text-gray-600 text-sm">
                      Koramangala, Bangalore<br />
                      Karnataka - 560034, India
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Hours */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="text-gray-900">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="text-gray-900">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-900">Closed</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  <strong>Emergency Support:</strong> Available 24/7 for Pro & Automation plan users
                </p>
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="text-lg mb-4 text-gray-900">Quick Help</h3>
              <div className="space-y-3 text-sm">
                <button 
                  onClick={() => toast.info('FAQ page opening soon!')}
                  className="w-full text-left text-blue-600 hover:text-blue-700 transition-colors"
                >
                  → View FAQs
                </button>
                <button 
                  onClick={() => toast.info('Help Center coming soon!')}
                  className="w-full text-left text-blue-600 hover:text-blue-700 transition-colors"
                >
                  → Help Center
                </button>
                <button 
                  onClick={() => toast.info('Video Tutorials available in app!')}
                  className="w-full text-left text-blue-600 hover:text-blue-700 transition-colors"
                >
                  → Video Tutorials
                </button>
                <button 
                  onClick={() => toast.info('Community launching soon!')}
                  className="w-full text-left text-blue-600 hover:text-blue-700 transition-colors"
                >
                  → Community Forum
                </button>
              </div>
            </Card>

            {/* CTA */}
            <Card className="p-6 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg mb-2">Not a Customer Yet?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Start your 7-day free trial today
                </p>
                <Button 
                  variant="secondary"
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                >
                  Start Free Trial
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}