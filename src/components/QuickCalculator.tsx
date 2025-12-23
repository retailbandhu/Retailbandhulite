import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface QuickCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCalculator({ isOpen, onClose }: QuickCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  if (!isOpen) return null;

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    try {
      const fullEquation = equation + display;
      const result = eval(fullEquation.replace(/×/g, '*').replace(/÷/g, '/'));
      setDisplay(result.toString());
      setEquation('');
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setIsNewNumber(false);
    }
  };

  const buttons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Quick Calculator</h3>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Display */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          {equation && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 h-5">
              {equation}
            </div>
          )}
          <div className="text-4xl font-mono text-right text-gray-900 dark:text-white break-all">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4">
          {/* Clear and Backspace */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Button
              onClick={handleClear}
              variant="outline"
              className="h-12 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              AC
            </Button>
            <Button
              onClick={handleBackspace}
              variant="outline"
              className="h-12"
            >
              <Delete className="w-5 h-5" />
            </Button>
          </div>

          {/* Number pad */}
          <div className="grid gap-2">
            {buttons.map((row, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                {row.map((btn) => {
                  const isOperator = ['÷', '×', '-', '+', '='].includes(btn);
                  const isZero = btn === '0';
                  
                  return (
                    <Button
                      key={btn}
                      onClick={() => {
                        if (btn === '=') handleEquals();
                        else if (btn === '.') handleDecimal();
                        else if (isOperator) handleOperator(btn);
                        else handleNumber(btn);
                      }}
                      variant={isOperator ? 'default' : 'outline'}
                      className={`h-14 text-lg font-semibold ${
                        isOperator
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      } ${isZero ? 'col-span-2' : ''}`}
                    >
                      {btn}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Quick conversion helpers */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick conversions:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => {
                  const val = parseFloat(display);
                  if (!isNaN(val)) {
                    setDisplay((val / 100).toString());
                    setIsNewNumber(true);
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                ÷100
              </Button>
              <Button
                onClick={() => {
                  const val = parseFloat(display);
                  if (!isNaN(val)) {
                    setDisplay((val * 1.18).toString());
                    setIsNewNumber(true);
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                +18% GST
              </Button>
              <Button
                onClick={() => {
                  const val = parseFloat(display);
                  if (!isNaN(val)) {
                    setDisplay((val / 1.18).toString());
                    setIsNewNumber(true);
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                -GST
              </Button>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="px-4 pb-4">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            💡 Tip: Use keyboard for faster calculations
          </p>
        </div>
      </Card>
    </div>
  );
}
