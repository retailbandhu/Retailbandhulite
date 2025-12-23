import { useState, useEffect } from 'react';
import { X, Mic, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Screen } from '../types';
import bandhuMascot from 'figma:asset/4d93b3d1b087e58174e0c66cc9a52e892bfab633.png';

interface AiAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (screen: Screen) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function AiAssistant({ isOpen, onToggle, onNavigate }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setMessages([
        {
          id: '1',
          text: 'Namaste 👋! Main Bandhu hoon, aapka digital assistant. Kya aapko bill banana hai ya report dekhni hai?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      let botResponse = '';
      const lowerInput = inputText.toLowerCase();

      if (lowerInput.includes('bill') || lowerInput.includes('billing')) {
        botResponse = 'Bilkul! Main aapko billing screen par le ja raha hoon. Aap voice se bhi bill bana sakte hain! 🎙️';
        setTimeout(() => onNavigate('billing'), 1500);
      } else if (lowerInput.includes('report') || lowerInput.includes('sales')) {
        botResponse = 'Reports dekh rahe hain! Aapka sales data ready hai. 📊';
        setTimeout(() => onNavigate('reports'), 1500);
      } else if (lowerInput.includes('inventory') || lowerInput.includes('stock')) {
        botResponse = 'Inventory management ke liye le ja raha hoon. Aap wahan se products add kar sakte hain! 📦';
        setTimeout(() => onNavigate('inventory'), 1500);
      } else if (lowerInput.includes('catalog')) {
        botResponse = 'Digital catalog banane ke liye ready hain? Chaliye! 🛍️';
        setTimeout(() => onNavigate('catalog'), 1500);
      } else if (lowerInput.includes('khata') || lowerInput.includes('udhaar') || lowerInput.includes('credit')) {
        botResponse = 'Khata book khol raha hoon! Customer credits dekh sakte hain. 💰';
        setTimeout(() => onNavigate('khata'), 1500);
      } else if (lowerInput.includes('expense') || lowerInput.includes('kharcha') || lowerInput.includes('kharche')) {
        botResponse = 'Expense tracker khol raha hoon! Apne kharche track karein. 📝';
        setTimeout(() => onNavigate('expenses'), 1500);
      } else if (lowerInput.includes('whatsapp')) {
        botResponse = 'WhatsApp automation tools ready hain! Bulk messages bhejiye. 💬';
        setTimeout(() => onNavigate('whatsapp'), 1500);
      } else if (lowerInput.includes('help') || lowerInput.includes('madad')) {
        botResponse = 'Main yahan hoon madad ke liye! Aap mujhse ye pooch sakte hain:\n\n• "Bill banana hai"\n• "Sales report dikha"\n• "Inventory check karo"\n• "Catalog banao"\n• "Khata dikhao"\n• "Expense track karo"\n\nKya help chahiye?';
      } else {
        botResponse = 'Samajh nahi aaya. Kya aap ye kehna chahte hain:\n\n• Bill banao\n• Report dikhao\n• Inventory manage karo\n• Digital catalog banao\n• Khata dekhiye\n• Expense add karein';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setInputText('Bill banana hai');
      setIsListening(false);
    }, 2000);
  };

  const quickActions = [
    { label: '🎙️ Bill Banao', action: () => onNavigate('billing') },
    { label: '📊 Reports Dekho', action: () => onNavigate('reports') },
    { label: '📦 Inventory', action: () => onNavigate('inventory') },
    { label: '🛍️ Catalog', action: () => onNavigate('catalog') }
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
        onClick={onToggle}
      />

      {/* Chat Panel */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl flex flex-col pointer-events-auto" style={{ height: '80vh' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={bandhuMascot} alt="Bandhu" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-white">Bandhu AI Assistant</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-white/80 text-xs">Online</p>
              </div>
            </div>
          </div>
          <button onClick={onToggle} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="pt-4">
              <p className="text-gray-600 text-sm mb-3 text-center">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-3 text-sm text-gray-900 hover:shadow-md transition-shadow"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleVoiceInput}
              disabled={isListening}
              className={`w-10 h-10 rounded-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] flex items-center justify-center text-white ${
                isListening ? 'animate-pulse' : ''
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <Input
              type="text"
              placeholder={isListening ? 'Listening...' : 'Type your message...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isListening}
              className="flex-1 h-10"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] flex items-center justify-center text-white disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Powered by Retail Bandhu AI
          </p>
        </div>
      </div>
    </div>
  );
}