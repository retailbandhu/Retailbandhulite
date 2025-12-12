import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X, Keyboard, Zap } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcuts: Shortcut[] = [
    // Navigation
    { keys: ['⌘', 'K'], description: 'Open global search', category: 'Navigation' },
    { keys: ['⌘', 'H'], description: 'Go to dashboard', category: 'Navigation' },
    { keys: ['⌘', 'B'], description: 'New bill', category: 'Navigation' },
    { keys: ['⌘', 'I'], description: 'Open inventory', category: 'Navigation' },
    { keys: ['⌘', 'P'], description: 'Quick POS mode', category: 'Navigation' },
    { keys: ['⌘', 'R'], description: 'View reports', category: 'Navigation' },
    { keys: ['⌘', ','], description: 'Open settings', category: 'Navigation' },
    { keys: ['Esc'], description: 'Close modal/dialog', category: 'Navigation' },
    
    // Actions
    { keys: ['⌘', 'S'], description: 'Save current form', category: 'Actions' },
    { keys: ['⌘', 'Enter'], description: 'Submit/Confirm', category: 'Actions' },
    { keys: ['⌘', 'N'], description: 'Create new item', category: 'Actions' },
    { keys: ['⌘', 'D'], description: 'Duplicate item', category: 'Actions' },
    { keys: ['⌘', 'Delete'], description: 'Delete selected', category: 'Actions' },
    
    // Search & Filter
    { keys: ['⌘', 'F'], description: 'Search in page', category: 'Search' },
    { keys: ['⌘', 'G'], description: 'Find next', category: 'Search' },
    { keys: ['⌘', 'Shift', 'F'], description: 'Advanced filters', category: 'Search' },
    
    // View
    { keys: ['⌘', '+'], description: 'Zoom in', category: 'View' },
    { keys: ['⌘', '-'], description: 'Zoom out', category: 'View' },
    { keys: ['⌘', '0'], description: 'Reset zoom', category: 'View' },
    { keys: ['⌘', 'Shift', 'D'], description: 'Toggle dark mode', category: 'View' },
    
    // Help
    { keys: ['⌘', '?'], description: 'Show shortcuts', category: 'Help' },
    { keys: ['F1'], description: 'Open help center', category: 'Help' },
  ];

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as { [key: string]: Shortcut[] });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Keyboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
                <p className="text-sm text-gray-600">Work faster with keyboard shortcuts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(groupedShortcuts).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900">{category}</h3>
                </div>
                <div className="space-y-2">
                  {items.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <React.Fragment key={i}>
                            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 shadow-sm">
                              {key}
                            </kbd>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 mx-1">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="secondary">Pro Tip</Badge>
              <span>Use ⌘+K to quickly navigate anywhere</span>
            </div>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hook to show keyboard shortcuts with ? key
export function useKeyboardShortcutsHelp(onOpen: () => void) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '?') {
        e.preventDefault();
        onOpen();
      }
      if (e.key === 'F1') {
        e.preventDefault();
        onOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}
