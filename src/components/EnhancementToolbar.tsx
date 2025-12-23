import React, { useState } from 'react';
import { 
  Calculator, 
  Upload, 
  Calendar, 
  Accessibility, 
  Download,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { useDarkMode } from '../hooks/useDarkMode';
import { QuickCalculator } from './QuickCalculator';
import { BulkProductImport } from './BulkProductImport';
import { DateRangePicker } from './DateRangePicker';
import { AccessibilityMenu, useAccessibilityShortcut } from './AccessibilityMenu';
import { ExportDataDialog } from './ExportDataDialog';
import type { Product } from '../types';

interface EnhancementToolbarProps {
  products?: Product[];
  onProductsImport?: (products: Product[]) => void;
  onDateRangeSelect?: (startDate: Date, endDate: Date, label: string) => void;
}

export function EnhancementToolbar({ 
  products = [], 
  onProductsImport,
  onDateRangeSelect 
}: EnhancementToolbarProps) {
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Enable Alt+A shortcut for accessibility menu
  useAccessibilityShortcut(() => setShowAccessibility(true));

  const tools = [
    {
      icon: isDark ? Sun : Moon,
      label: isDark ? 'Light Mode' : 'Dark Mode',
      onClick: toggleDarkMode,
      color: isDark ? 'text-yellow-500' : 'text-indigo-600',
      bgHover: isDark ? 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
    },
    {
      icon: Calculator,
      label: 'Calculator',
      onClick: () => setShowCalculator(true),
      color: 'text-blue-600 dark:text-blue-400',
      bgHover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      icon: Upload,
      label: 'Bulk Import',
      onClick: () => setShowBulkImport(true),
      color: 'text-green-600 dark:text-green-400',
      bgHover: 'hover:bg-green-50 dark:hover:bg-green-900/20'
    },
    {
      icon: Calendar,
      label: 'Date Range',
      onClick: () => setShowDatePicker(true),
      color: 'text-purple-600 dark:text-purple-400',
      bgHover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
    },
    {
      icon: Accessibility,
      label: 'Accessibility',
      onClick: () => setShowAccessibility(true),
      color: 'text-orange-600 dark:text-orange-400',
      bgHover: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
      badge: 'Alt+A'
    },
    {
      icon: Download,
      label: 'Export Data',
      onClick: () => setShowExport(true),
      color: 'text-teal-600 dark:text-teal-400',
      bgHover: 'hover:bg-teal-50 dark:hover:bg-teal-900/20'
    }
  ];

  return (
    <>
      {/* Floating Toolbar */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-200 dark:border-gray-700 p-2 flex gap-1">
          {/* Enhancement Badge */}
          <div className="flex items-center gap-2 px-3 border-r border-gray-200 dark:border-gray-700">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 hidden sm:inline">
              Elite
            </span>
          </div>

          {/* Tool Buttons */}
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Button
                key={index}
                onClick={tool.onClick}
                variant="ghost"
                size="sm"
                className={`relative rounded-full w-10 h-10 p-0 transition-all ${tool.bgHover}`}
                title={tool.label}
              >
                <Icon className={`w-5 h-5 ${tool.color}`} />
                {tool.badge && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] px-1 rounded-full">
                    {tool.badge}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Floating label on hover */}
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Enhancement Tools
          </span>
        </div>
      </div>

      {/* Modals */}
      <QuickCalculator 
        isOpen={showCalculator} 
        onClose={() => setShowCalculator(false)} 
      />

      <BulkProductImport
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        onImport={(newProducts) => {
          if (onProductsImport) {
            onProductsImport(newProducts);
          }
          setShowBulkImport(false);
        }}
      />

      <DateRangePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onApply={(startDate, endDate, label) => {
          if (onDateRangeSelect) {
            onDateRangeSelect(startDate, endDate, label);
          }
          setShowDatePicker(false);
        }}
      />

      <AccessibilityMenu
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />

      <ExportDataDialog
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
    </>
  );
}
