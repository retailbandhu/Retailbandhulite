import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Store,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gift,
  Users
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LeadCaptureFormProps {
  onSuccess?: (data: any) => void;
  variant?: 'signup' | 'trial' | 'demo' | 'newsletter';
  title?: string;
  subtitle?: string;
}

export function LeadCaptureForm({ 
  onSuccess, 
  variant = 'trial',
  title,
  subtitle
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    storeType: '',
    monthlyBills: '',
    hearAbout: '',
    agreeTerms: false,
    agreeWhatsApp: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast.error('Please accept terms and conditions');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Welcome to Retail Bandhu! 🎉');
      
      if (onSuccess) {
        onSuccess(formData);
      }
    }, 1500);
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const titles = {
    signup: 'Create Your Account',
    trial: 'Start Your 7-Day Free Trial',
    demo: 'Schedule a Demo',
    newsletter: 'Join Our Newsletter'
  };

  const subtitles = {
    signup: 'Apni dukaan ka digital safar shuru karein',
    trial: 'No credit card required • Cancel anytime',
    demo: 'We\'ll show you everything in 15 minutes',
    newsletter: 'Weekly tips for growing your kirana business'
  };

  const benefits = {
    signup: [
      'Instant access to all features',
      'Free forever plan available',
      'WhatsApp support included',
      'No setup fees'
    ],
    trial: [
      'Full Pro features for 7 days',
      'Unlimited bills and inventory',
      'Voice billing enabled',
      'No credit card needed'
    ],
    demo: [
      'Personalized walkthrough',
      'Ask unlimited questions',
      'See your specific use case',
      'Get implementation help'
    ],
    newsletter: [
      'Weekly business tips',
      'Exclusive discounts',
      'Feature updates first',
      'Success stories'
    ]
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl mb-3 text-gray-900">Welcome Aboard! 🎉</h2>
        <p className="text-lg text-gray-600 mb-6">
          {variant === 'trial' && 'Your 7-day free trial has started. Check your WhatsApp for login details!'}
          {variant === 'signup' && 'Account created successfully! Check your email for next steps.'}
          {variant === 'demo' && 'Demo scheduled! We\'ll call you within 24 hours.'}
          {variant === 'newsletter' && 'You\'re subscribed! First email coming your way soon.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
            onClick={() => onSuccess?.(formData)}
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline">
            Watch Tutorial
          </Button>
        </div>
        
        <Card className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200">
          <h4 className="mb-3 text-gray-900">Next Steps:</h4>
          <div className="space-y-2 text-left text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>1. Complete your store setup (2 minutes)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>2. Add your first 10 products</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>3. Create your first voice bill</span>
            </div>
          </div>
        </Card>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Form */}
        <Card className="p-8">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              {variant === 'trial' && 'Free Trial'}
              {variant === 'signup' && 'Get Started'}
              {variant === 'demo' && 'Live Demo'}
              {variant === 'newsletter' && 'Stay Updated'}
            </Badge>
            <h2 className="text-3xl mb-2 text-gray-900">
              {title || titles[variant]}
            </h2>
            <p className="text-gray-600">
              {subtitle || subtitles[variant]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Store Name */}
            <div>
              <Label htmlFor="storeName" className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4" />
                Dukaan Ka Naam *
              </Label>
              <Input
                id="storeName"
                placeholder="e.g., Sharma Kirana Store"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                required
              />
            </div>

            {/* Owner Name */}
            <div>
              <Label htmlFor="ownerName" className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                Aapka Naam *
              </Label>
              <Input
                id="ownerName"
                placeholder="e.g., Ramesh Sharma"
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                WhatsApp Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Login details will be sent here
              </p>
            </div>

            {/* Email (optional for newsletter, required for others) */}
            {variant !== 'newsletter' && (
              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email {variant === 'newsletter' ? '*' : '(Optional)'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required={variant === 'newsletter'}
                />
              </div>
            )}

            {/* Location */}
            {variant !== 'newsletter' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="mb-2 block">City *</Label>
                  <Input
                    id="city"
                    placeholder="Delhi"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="mb-2 block">State *</Label>
                  <Select onValueChange={(value) => handleChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="up">Uttar Pradesh</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Store Details */}
            {variant !== 'newsletter' && (
              <>
                <div>
                  <Label htmlFor="storeType" className="mb-2 block">
                    Store Type *
                  </Label>
                  <Select onValueChange={(value) => handleChange('storeType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kirana">Kirana Store</SelectItem>
                      <SelectItem value="general">General Store</SelectItem>
                      <SelectItem value="provision">Provision Store</SelectItem>
                      <SelectItem value="supermarket">Supermarket</SelectItem>
                      <SelectItem value="medical">Medical Store</SelectItem>
                      <SelectItem value="other">Other Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="monthlyBills" className="mb-2 block">
                    Approx. Bills Per Month *
                  </Label>
                  <Select onValueChange={(value) => handleChange('monthlyBills', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-100">0-100 bills</SelectItem>
                      <SelectItem value="100-500">100-500 bills</SelectItem>
                      <SelectItem value="500-1000">500-1000 bills</SelectItem>
                      <SelectItem value="1000+">1000+ bills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hearAbout" className="mb-2 block">
                    How did you hear about us?
                  </Label>
                  <Select onValueChange={(value) => handleChange('hearAbout', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="friend">Friend Referral</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleChange('agreeTerms', checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-tight cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="whatsapp"
                  checked={formData.agreeWhatsApp}
                  onCheckedChange={(checked) => handleChange('agreeWhatsApp', checked)}
                />
                <label htmlFor="whatsapp" className="text-sm text-gray-700 leading-tight cursor-pointer">
                  Send me tips and updates on WhatsApp
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  {variant === 'trial' && 'Start Free Trial'}
                  {variant === 'signup' && 'Create Account'}
                  {variant === 'demo' && 'Schedule Demo'}
                  {variant === 'newsletter' && 'Subscribe'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By signing up, you agree that your data will be stored securely. 
              We never share your information.
            </p>
          </form>
        </Card>

        {/* Right: Benefits */}
        <div className="space-y-6">
          {/* Benefits List */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200">
            <h3 className="text-xl mb-4 text-gray-900">
              {variant === 'trial' && 'What You Get'}
              {variant === 'signup' && 'Why Choose Us'}
              {variant === 'demo' && 'In The Demo'}
              {variant === 'newsletter' && 'Newsletter Benefits'}
            </h3>
            <ul className="space-y-3">
              {benefits[variant].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Social Proof */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-orange-400 border-2 border-white" />
                ))}
              </div>
              <div>
                <p className="text-gray-900">5000+ retailers</p>
                <p className="text-sm text-gray-600">joined this month</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
              <span className="text-gray-900 ml-2">4.8/5</span>
            </div>
            <p className="text-sm text-gray-600">
              "Best billing app for kirana stores. Voice feature is amazing!" - Ramesh, Delhi
            </p>
          </Card>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-900">100% Secure</p>
              <p className="text-xs text-gray-600">Bank-grade encryption</p>
            </Card>
            <Card className="p-4 text-center">
              <Gift className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-900">Free Forever</p>
              <p className="text-xs text-gray-600">No credit card needed</p>
            </Card>
          </div>

          {/* Help */}
          <Card className="p-4 bg-gray-50">
            <p className="text-sm text-gray-700 mb-2">Need help?</p>
            <div className="flex gap-3">
              <Button size="sm" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
              <Button size="sm" variant="outline">
                WhatsApp Chat
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
