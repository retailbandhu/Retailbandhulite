import React from 'react';
import { Keyboard, Command, Search, Calculator, Calendar, Accessibility, Download, Zap } from 'lucide-react';
import { Card } from './ui/card';

interface ShortcutGroup {
  title: string;
  icon: React.ElementType;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

export function KeyboardShortcutsCard() {
  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Navigation',
      icon: Command,
      shortcuts: [
        { keys: ['Ctrl/Cmd', 'K'], description: 'Global Search' },
        { keys: ['Ctrl/Cmd', '/'], description: 'Keyboard Shortcuts' },
        { keys: ['Esc'], description: 'Close Modal/Dialog' },
        { keys: ['?'], description: 'Help Center' }
      ]
    },
    {
      title: 'Voice Features',
      icon: Zap,
      shortcuts: [
        { keys: ['Ctrl/Cmd', 'Shift', 'V'], description: 'Voice Search' },
        { keys: ['Space'], description: 'Push to Talk (when voice active)' }
      ]
    },
    {
      title: 'Enhancement Tools',
      icon: Calculator,
      shortcuts: [
        { keys: ['Alt', 'A'], description: 'Accessibility Menu' },
        { keys: ['Alt', 'C'], description: 'Quick Calculator (coming soon)' },
        { keys: ['Alt', 'E'], description: 'Export Data (coming soon)' }
      ]
    },
    {
      title: 'Billing',
      icon: Keyboard,
      shortcuts: [
        { keys: ['Ctrl/Cmd', 'Enter'], description: 'Complete Bill' },
        { keys: ['Ctrl/Cmd', 'N'], description: 'New Bill' },
        { keys: ['Ctrl/Cmd', 'P'], description: 'Print Bill' }
      ]
    }
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const formatKey = (key: string) => {
    if (key === 'Ctrl/Cmd') {
      return isMac ? '⌘' : 'Ctrl';
    }
    if (key === 'Alt') {
      return isMac ? '⌥' : 'Alt';
    }
    if (key === 'Shift') {
      return isMac ? '⇧' : 'Shift';
    }
    return key;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Keyboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Work faster with these shortcuts
          </p>
        </div>
      </div>

      {shortcutGroups.map((group, index) => {
        const Icon = group.icon;
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {group.title}
              </h4>
            </div>
            <div className="space-y-2">
              {group.shortcuts.map((shortcut, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIdx) => (
                      <React.Fragment key={keyIdx}>
                        <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white">
                          {formatKey(key)}
                        </kbd>
                        {keyIdx < shortcut.keys.length - 1 && (
                          <span className="text-gray-400 dark:text-gray-500 text-xs">
                            +
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              💡 Pro Tip
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Press <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-700 rounded">
                {isMac ? '⌘' : 'Ctrl'}
              </kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-700 rounded">
                /
              </kbd> anytime to see this guide!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
