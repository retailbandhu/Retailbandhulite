import { useState } from 'react';
import { ChevronRight, Mic, MessageCircle, Gift } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingSlidesProps {
  onComplete: () => void;
}

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Mic,
      emoji: '🎙️',
      title: 'Voice Billing Made Easy',
      titleHindi: 'आवाज़ से बिलिंग, बिल्कुल आसान',
      description: 'Bas bolo — "2 Maggie ₹12 each" — aur Bandhu bill bana dega!',
      color: 'text-[#1E88E5]',
      bgColor: 'bg-[#1E88E5]/10'
    },
    {
      icon: MessageCircle,
      emoji: '💬',
      title: 'Send Bills via WhatsApp',
      titleHindi: 'WhatsApp पर भेजें बिल',
      description: 'Apne customers ko instantly WhatsApp par bill bhejiye. No printer needed!',
      color: 'text-[#FF6F00]',
      bgColor: 'bg-[#FF6F00]/10'
    },
    {
      icon: Gift,
      emoji: '🎁',
      title: 'Free Forever, Simple to Use',
      titleHindi: 'हमेशा मुफ्त, बेहद सिंपल',
      description: 'Koi hidden charges nahi. Shuru karein apna digital dukaan aaj hi!',
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/10 to-[#FF6F00]/10 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Icon Display - Using lucide-react icons in colored container */}
        <div className={`mb-8 w-32 h-32 rounded-3xl ${slides[currentSlide].bgColor} flex items-center justify-center`}>
          {(() => {
            const IconComponent = slides[currentSlide].icon;
            return <IconComponent className={`w-16 h-16 ${slides[currentSlide].color}`} />;
          })()}
        </div>

        {/* Slide Content */}
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl text-gray-900">
            {slides[currentSlide].emoji} {slides[currentSlide].title}
          </h2>
          
          <p className="text-xl text-gray-700">
            {slides[currentSlide].titleHindi}
          </p>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center space-x-2 mt-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-[#1E88E5]' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 space-y-3">
        <Button 
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
        >
          {currentSlide < slides.length - 1 ? 'Aage Badhein' : 'Shuru Karein'}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
        
        {currentSlide < slides.length - 1 && (
          <button 
            onClick={handleSkip}
            className="w-full text-gray-600 py-3"
          >
            Skip
          </button>
        )}
      </div>

      <div className="pb-4 text-center">
        <p className="text-gray-500 text-sm">
          Powered by Retail Bandhu — Har Dukaan, Digital Dukaan.
        </p>
      </div>
    </div>
  );
}