import React, { useState, useEffect } from 'react';
import { Accessibility, Type, Contrast, ZoomIn, ZoomOut, Volume2, VolumeX } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
}

export function AccessibilityMenu({ isOpen, onClose }: AccessibilityMenuProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    return saved ? JSON.parse(saved) : {
      fontSize: 100,
      highContrast: false,
      reduceMotion: false,
      screenReaderMode: false,
      keyboardNavigation: true
    };
  });

  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (settings: AccessibilitySettings) => {
    // Font size
    document.documentElement.style.fontSize = `${settings.fontSize}%`;

    // High contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Reduce motion
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    // Screen reader mode (add aria-live regions)
    if (settings.screenReaderMode) {
      document.documentElement.setAttribute('data-screen-reader', 'true');
    } else {
      document.documentElement.removeAttribute('data-screen-reader');
    }

    // Keyboard navigation highlights
    if (settings.keyboardNavigation) {
      document.documentElement.classList.add('keyboard-nav');
    } else {
      document.documentElement.classList.remove('keyboard-nav');
    }
  };

  if (!isOpen) return null;

  const increaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 10, 150)
    }));
  };

  const decreaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 10, 80)
    }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      highContrast: false,
      reduceMotion: false,
      screenReaderMode: false,
      keyboardNavigation: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Accessibility className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Accessibility Settings
            </h3>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            ✕
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Size
              </Label>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {settings.fontSize}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={decreaseFontSize}
                variant="outline"
                size="sm"
                disabled={settings.fontSize <= 80}
                className="flex-1"
              >
                <ZoomOut className="w-4 h-4 mr-2" />
                Smaller
              </Button>
              <Button
                onClick={increaseFontSize}
                variant="outline"
                size="sm"
                disabled={settings.fontSize >= 150}
                className="flex-1"
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                Larger
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Adjust text size for better readability
            </p>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Contrast className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <Label className="font-semibold">High Contrast</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Increase color contrast
                </p>
              </div>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, highContrast: checked }))
              }
            />
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <Label className="font-semibold">Reduce Motion</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Minimize animations
                </p>
              </div>
            </div>
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, reduceMotion: checked }))
              }
            />
          </div>

          {/* Screen Reader Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <Label className="font-semibold">Screen Reader</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enhanced announcements
                </p>
              </div>
            </div>
            <Switch
              checked={settings.screenReaderMode}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, screenReaderMode: checked }))
              }
            />
          </div>

          {/* Keyboard Navigation */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-xl">⌨️</span>
              <div>
                <Label className="font-semibold">Keyboard Navigation</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Highlight focused elements
                </p>
              </div>
            </div>
            <Switch
              checked={settings.keyboardNavigation}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, keyboardNavigation: checked }))
              }
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={resetSettings} variant="outline" className="flex-1">
              Reset to Default
            </Button>
            <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600">
              Done
            </Button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>💡 Tip:</strong> Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border">A</kbd> to open this menu anytime
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hook for accessibility keyboard shortcut
export function useAccessibilityShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        onOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}
