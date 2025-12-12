import { useState } from 'react';
import { ArrowLeft, Globe, Check } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface LanguageSwitcherProps {
  onNavigate: (screen: Screen) => void;
}

export function LanguageSwitcher({ onNavigate }: LanguageSwitcherProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi' | 'hinglish'>('hinglish');

  const languages = [
    {
      id: 'hinglish' as const,
      name: 'Hinglish',
      nativeName: 'Hinglish (मिक्स)',
      description: 'Hindi + English mixed (Recommended)',
      icon: '🇮🇳',
      example: 'Aaj ka total sales ₹5,000 hai'
    },
    {
      id: 'hindi' as const,
      name: 'Hindi',
      nativeName: 'हिंदी',
      description: 'Pure Hindi language',
      icon: '🇮🇳',
      example: 'आज की कुल बिक्री ₹५,००० है'
    },
    {
      id: 'english' as const,
      name: 'English',
      nativeName: 'English',
      description: 'Full English language',
      icon: '🇬🇧',
      example: 'Today\'s total sales is ₹5,000'
    }
  ];

  const handleSaveLanguage = () => {
    localStorage.setItem('rb_language', selectedLanguage);
    toast.success(`Language changed to ${languages.find(l => l.id === selectedLanguage)?.name}!`);
    setTimeout(() => {
      onNavigate('settings');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('settings')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Language / भाषा</h1>
          <div className="w-6" />
        </div>
        <div className="text-center">
          <Globe className="w-12 h-12 text-white mx-auto mb-2" />
          <p className="text-white/90 text-sm">Choose your preferred language</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-4">
        {/* Language Options */}
        <div className="space-y-3">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => setSelectedLanguage(language.id)}
              className={`w-full bg-white rounded-xl shadow-md p-5 transition-all ${
                selectedLanguage === language.id
                  ? 'ring-2 ring-[#1E88E5] shadow-lg'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{language.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900">{language.name}</h3>
                      <p className="text-gray-500 text-sm">{language.nativeName}</p>
                    </div>
                    {selectedLanguage === language.id && (
                      <div className="w-6 h-6 bg-[#1E88E5] rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{language.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-700 text-sm italic">&quot;{language.example}&quot;</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-gray-900 mb-1">Why Hinglish?</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Most Indian retailers use a mix of Hindi and English in daily conversations. 
                Hinglish mode makes the app feel natural and familiar!
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveLanguage}
          className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
        >
          Save Language Preference
        </Button>

        {/* Note */}
        <p className="text-center text-gray-500 text-xs">
          Language baad mein bhi badal sakte hain Settings mein
        </p>
      </div>
    </div>
  );
}
