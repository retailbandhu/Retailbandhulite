import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Home,
  LayoutGrid,
  Play,
  GitCompare,
  Trophy,
  Calculator,
} from 'lucide-react';

interface FAQSectionProps {
  onContactSupport?: () => void;
  onBackToHome?: () => void;
}

export function FAQSection({ onContactSupport, onBackToHome }: FAQSectionProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      category: 'Getting Started',
      icon: Sparkles,
      faqs: [
        {
          q: 'How do I start using Retail Bandhu?',
          a: 'Simply sign up for a free account, complete your 2-minute store setup, add your products, and start billing! The whole onboarding process takes less than 5 minutes. We also have video tutorials to guide you.'
        },
        {
          q: 'Do I need any special equipment?',
          a: 'No! Just a smartphone with internet connection. The app works on any Android or iOS device. For barcode scanning, your phone\'s camera is enough. No additional hardware needed.'
        },
        {
          q: 'Is training required?',
          a: 'Not at all! The app is designed to be super simple. Most retailers start billing within 5 minutes. We have in-app tutorials, video guides, and our support team is always ready to help on WhatsApp.'
        },
        {
          q: 'Can I import my existing data?',
          a: 'Yes! You can import your product list, customer data, and inventory from Excel/CSV files. Our support team can help you with the import process for free.'
        }
      ]
    },
    {
      category: 'Voice Billing',
      icon: MessageSquare,
      faqs: [
        {
          q: 'How accurate is voice billing?',
          a: '95% accuracy! Our AI recognizes 10,000+ common products in Hindi, English, and Hinglish. It works even in noisy shop environments. If it misses something, you can quickly edit with one tap.'
        },
        {
          q: 'Which languages does it support?',
          a: 'Hindi, English, and Hinglish (mix of both). You can speak naturally - "2 kg chawal, 1 Maggi packet, teen Parle-G" - and it will understand perfectly!'
        },
        {
          q: 'Does voice billing work offline?',
          a: 'Basic voice recognition works offline, but for best accuracy and latest product recognition, internet connection is recommended. Bills can be created offline and synced when online.'
        },
        {
          q: 'Can I add custom products via voice?',
          a: 'Yes! If the AI doesn\'t recognize a product, you can quickly add it manually once, and it will remember for next time. You can also teach it your local product names.'
        }
      ]
    },
    {
      category: 'Pricing & Plans',
      icon: HelpCircle,
      faqs: [
        {
          q: 'Is there really a free plan forever?',
          a: 'Yes! Our Free plan with 100 bills/month, basic features, and WhatsApp sharing is completely free forever. No credit card needed. Perfect for small stores getting started.'
        },
        {
          q: 'What happens after my 7-day trial?',
          a: 'Your card won\'t be charged automatically. You\'ll get a reminder and can choose to upgrade to Pro (₹299/mo) or Automation (₹599/mo), or continue with the Free plan. No surprise charges!'
        },
        {
          q: 'Can I upgrade or downgrade anytime?',
          a: 'Absolutely! Upgrade instantly to access more features. Downgrade at the end of your billing cycle. No lock-in contracts, cancel anytime with one click.'
        },
        {
          q: 'Do you offer refunds?',
          a: '7-day money-back guarantee! If you\'re not satisfied for any reason within 7 days of payment, we\'ll refund 100% - no questions asked. Your satisfaction is our priority.'
        },
        {
          q: 'Are there any hidden charges?',
          a: 'Zero hidden charges! The price you see is the price you pay. No setup fees, no transaction fees, no per-bill charges. Simple, transparent pricing.'
        }
      ]
    },
    {
      category: 'WhatsApp Integration',
      icon: MessageSquare,
      faqs: [
        {
          q: 'Do I need WhatsApp Business API?',
          a: 'No! Works with regular WhatsApp. The app uses your phone\'s WhatsApp to share bills. For automation features (Pro+), we integrate with WhatsApp Business API which we help you set up.'
        },
        {
          q: 'Can I send bills directly to customers?',
          a: 'Yes! One tap and the bill PDF is shared on customer\'s WhatsApp. You can also share catalogs, payment reminders, and promotional messages. Customers receive professional PDF bills.'
        },
        {
          q: 'How does automated follow-up work?',
          a: 'In Automation plan, you can set rules like "Send payment reminder 3 days before due date" or "Send thank you message after purchase". It runs automatically - you just set it once!'
        },
        {
          q: 'Is bulk messaging allowed?',
          a: 'Yes, with Automation plan. You can broadcast catalogs, offers, and updates to all customers. We follow WhatsApp guidelines to ensure your account stays safe.'
        }
      ]
    },
    {
      category: 'Inventory & Stock',
      icon: HelpCircle,
      faqs: [
        {
          q: 'How does auto inventory update work?',
          a: 'Every time you create a bill, stock is automatically deducted. When stock falls below your set minimum, you get an alert. No manual counting or Excel sheets needed!'
        },
        {
          q: 'Can I track product expiry dates?',
          a: 'Yes! Add expiry dates while adding products. Get alerts 30/15/7 days before expiry. Perfect for FMCG items, medicines, and perishables.'
        },
        {
          q: 'Does barcode scanning work for all products?',
          a: 'Works with standard EAN/UPC barcodes found on most packaged products. For local/unpackaged items, you can create your own barcode labels or use product search.'
        },
        {
          q: 'How do I handle returns?',
          a: 'Simple return process - find the bill, mark items as returned, and stock is automatically added back. Customer credit/khata is also auto-updated.'
        }
      ]
    },
    {
      category: 'GST & Compliance',
      icon: HelpCircle,
      faqs: [
        {
          q: 'Is it GST compliant?',
          a: '100% GST compliant! Auto CGST/SGST/IGST calculation, HSN code management, and ready-to-file GSTR-1 and GSTR-3B reports. Verified by CA experts.'
        },
        {
          q: 'Can I generate GST reports?',
          a: 'Yes! One-click GST reports for any date range. Download in Excel format ready for filing. Includes all required details - GSTIN, HSN, tax breakup, etc.'
        },
        {
          q: 'What if I\'m not registered for GST?',
          a: 'No problem! You can create bills without GST. When you get GST registration, just add your GSTIN in settings and GST will be applied automatically on new bills.'
        },
        {
          q: 'Can I customize tax rates?',
          a: 'Yes! Set different GST rates (0%, 5%, 12%, 18%, 28%) for different products. Cess and state-specific taxes also supported.'
        }
      ]
    },
    {
      category: 'Data & Security',
      icon: HelpCircle,
      faqs: [
        {
          q: 'Is my data safe?',
          a: 'Bank-grade encryption! All data is encrypted in transit and at rest. Regular backups, secure servers, and we never share your data with anyone. Your business data is 100% private.'
        },
        {
          q: 'What if I lose my phone?',
          a: 'All data is backed up in cloud. Just login from new device and all your data is there! You can also enable 2-factor authentication for extra security.'
        },
        {
          q: 'Can I export my data?',
          a: 'Yes! Export bills, inventory, customers, and all data to Excel/PDF anytime. Your data is yours - no vendor lock-in. Download and leave whenever you want.'
        },
        {
          q: 'Do you collect customer personal information?',
          a: 'We only store what you enter - name, phone, address for billing. We don\'t access or share customer data. Figma Make is not meant for collecting PII or securing sensitive data.'
        }
      ]
    },
    {
      category: 'Support & Help',
      icon: Phone,
      faqs: [
        {
          q: 'How do I get support?',
          a: 'Free plan: Email support (24h response). Pro plan: WhatsApp support (4h response). Automation plan: Priority 24/7 support with dedicated manager. Also video tutorials and help docs.'
        },
        {
          q: 'Do you provide training?',
          a: 'Yes! Free video tutorials, in-app guided tours, and help docs for all users. Pro+ plans get personalized onboarding calls. We also conduct free webinars weekly.'
        },
        {
          q: 'What languages does support work in?',
          a: 'Hindi and English! Our support team is comfortable in both languages. We understand that most kirana owners prefer Hindi, so we\'re fully equipped for that.'
        },
        {
          q: 'Can I request new features?',
          a: 'Absolutely! We love feedback. Submit feature requests via app or WhatsApp. We actively build features based on user requests. Many current features came from retailer suggestions!'
        }
      ]
    }
  ];

  const allFAQs = faqCategories.flatMap((category, catIndex) =>
    category.faqs.map((faq, faqIndex) => ({
      ...faq,
      categoryName: category.category,
      categoryIcon: category.icon,
      index: catIndex * 100 + faqIndex
    }))
  );

  const filteredFAQs = searchTerm
    ? allFAQs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allFAQs;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
          <HelpCircle className="w-3 h-3 mr-1" />
          Frequently Asked Questions
        </Badge>
        <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
          Saare Sawaal, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Saare Jawaab</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Common questions retailers ask us. Didn't find your answer? We're here to help!
        </p>
      </div>

      {/* Search */}
      <Card className="p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search questions... (e.g., 'GST', 'voice billing', 'pricing')"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* FAQs */}
      {searchTerm ? (
        // Search Results View
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const Icon = faq.categoryIcon;
              return (
                <Card
                  key={faq.index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setOpenFAQ(openFAQ === faq.index ? null : faq.index)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-blue-600" />
                          <Badge variant="outline" className="text-xs">
                            {faq.categoryName}
                          </Badge>
                        </div>
                        <h3 className="text-lg text-gray-900 mb-2">{faq.q}</h3>
                        {openFAQ === faq.index && (
                          <p className="text-gray-600 mt-3">{faq.a}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {openFAQ === faq.index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 text-center">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl mb-2 text-gray-900">No results found</h3>
              <p className="text-gray-600 mb-6">
                Couldn't find what you're looking for? Contact our support team!
              </p>
              <Button onClick={onContactSupport}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Card>
          )}
        </div>
      ) : (
        // Category View
        <div className="space-y-8">
          {faqCategories.map((category, catIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={catIndex}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
                    <CategoryIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-2xl text-gray-900">{category.category}</h3>
                </div>
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const index = catIndex * 100 + faqIndex;
                    return (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg text-gray-900 mb-2">{faq.q}</h4>
                              {openFAQ === index && (
                                <p className="text-gray-600 mt-3 leading-relaxed">{faq.a}</p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {openFAQ === index ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact Support */}
      <Card className="mt-12 p-8 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white text-center">
        <h3 className="text-2xl mb-3">Still Have Questions? 🤔</h3>
        <p className="text-lg mb-6 text-white/90">
          Humari team hamesha ready hai aapki madad ke liye!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={onContactSupport}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            WhatsApp Support
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Us
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Mail className="w-5 h-5 mr-2" />
            Email Support
          </Button>
        </div>
        <p className="mt-6 text-white/80 text-sm">
          Average response time: 2 hours • Available 9 AM - 9 PM
        </p>
      </Card>

      {/* Back to Home */}
      <div className="mt-12 text-center">
        <Button
          size="lg"
          variant="outline"
          className="border-gray-300 text-gray-500 hover:bg-gray-100"
          onClick={onBackToHome}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}