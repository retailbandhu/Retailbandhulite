import { Mic, Camera, FileText, Users, Building2, Scan } from 'lucide-react';
import { Screen } from '../types';

interface QuickActionsMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (screen: Screen) => void;
}

export function QuickActionsMenu({ isOpen, onToggle, onNavigate }: QuickActionsMenuProps) {
  const actions = [
    {
      icon: <Mic className="w-5 h-5" />,
      label: 'Quick Bill',
      gradient: 'from-blue-500 to-blue-600',
      onClick: () => {
        onNavigate('billing');
        onToggle();
      }
    },
    {
      icon: <Camera className="w-5 h-5" />,
      label: 'Quick POS',
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => {
        onNavigate('quick-pos');
        onToggle();
      }
    },
    {
      icon: <Scan className="w-5 h-5" />,
      label: 'Scan Barcode',
      gradient: 'from-indigo-500 to-indigo-600',
      onClick: () => {
        onNavigate('barcode-scanner');
        onToggle();
      }
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Add Expense',
      gradient: 'from-pink-500 to-pink-600',
      onClick: () => {
        onNavigate('expenses');
        onToggle();
      }
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Add Customer',
      gradient: 'from-red-500 to-red-600',
      onClick: () => {
        onNavigate('customers');
        onToggle();
      }
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      label: 'Add Party',
      gradient: 'from-orange-500 to-orange-600',
      onClick: () => {
        onNavigate('parties');
        onToggle();
      }
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Action Buttons */}
      {isOpen && (
        <div className="fixed bottom-32 left-6 z-50 space-y-3 animate-slide-up">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center space-x-3"
              style={{ 
                animation: `slideInLeft 0.3s ease-out ${index * 0.1}s both` 
              }}
            >
              <button
                onClick={action.onClick}
                className={`w-14 h-14 bg-gradient-to-r ${action.gradient} rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform`}
              >
                {action.icon}
              </button>
              <div className="bg-white px-3 py-2 rounded-lg shadow-lg">
                <p className="text-gray-900 text-sm whitespace-nowrap">{action.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}