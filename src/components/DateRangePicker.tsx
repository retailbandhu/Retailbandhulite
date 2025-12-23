import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: Date, endDate: Date, label: string) => void;
}

type PresetRange = {
  label: string;
  getValue: () => { start: Date; end: Date };
};

export function DateRangePicker({ isOpen, onClose, onApply }: DateRangePickerProps) {
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isOpen) return null;

  const presets: PresetRange[] = [
    {
      label: 'Today',
      getValue: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return { start: today, end: new Date() };
      }
    },
    {
      label: 'Yesterday',
      getValue: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const end = new Date(yesterday);
        end.setHours(23, 59, 59, 999);
        return { start: yesterday, end };
      }
    },
    {
      label: 'Last 7 Days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return { start, end };
      }
    },
    {
      label: 'Last 30 Days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        return { start, end };
      }
    },
    {
      label: 'This Month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start, end: new Date() };
      }
    },
    {
      label: 'Last Month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return { start, end };
      }
    },
    {
      label: 'This Year',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return { start, end: new Date() };
      }
    },
    {
      label: 'Last Year',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear() - 1, 0, 1);
        const end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        return { start, end };
      }
    }
  ];

  const handlePresetClick = (preset: PresetRange) => {
    const { start, end } = preset.getValue();
    onApply(start, end, preset.label);
    onClose();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const handleDateClick = (date: Date) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Start new selection
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      // Complete selection
      if (date < selectedStart) {
        setSelectedEnd(selectedStart);
        setSelectedStart(date);
      } else {
        setSelectedEnd(date);
      }
    }
  };

  const handleApply = () => {
    if (selectedStart && selectedEnd) {
      const label = `${selectedStart.toLocaleDateString('en-IN')} - ${selectedEnd.toLocaleDateString('en-IN')}`;
      onApply(selectedStart, selectedEnd, label);
      onClose();
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Week day headers
    days.push(
      <div key="headers" className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
    );

    // Empty cells before first day
    const cells = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = 
        (selectedStart && date.toDateString() === selectedStart.toDateString()) ||
        (selectedEnd && date.toDateString() === selectedEnd.toDateString());
      const isInRange = selectedStart && selectedEnd && date >= selectedStart && date <= selectedEnd;
      const isToday = date.toDateString() === new Date().toDateString();

      cells.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`
            aspect-square rounded-lg text-sm font-medium transition-all
            ${isSelected
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : isInRange
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
              : isToday
              ? 'border-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
            }
          `}
        >
          {day}
        </button>
      );
    }

    days.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    );

    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select Date Range</h3>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              ✕
            </Button>
          </div>

          <div className="grid md:grid-cols-[200px_1fr] gap-6">
            {/* Presets */}
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Select</h4>
              {presets.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div>
              {/* Month Navigator */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={() => {
                    const newMonth = new Date(currentMonth);
                    newMonth.setMonth(newMonth.getMonth() - 1);
                    setCurrentMonth(newMonth);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h4>
                <Button
                  onClick={() => {
                    const newMonth = new Date(currentMonth);
                    newMonth.setMonth(newMonth.getMonth() + 1);
                    setCurrentMonth(newMonth);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              {renderCalendar()}

              {/* Selected Range Display */}
              {(selectedStart || selectedEnd) && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Selected Range:</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedStart ? selectedStart.toLocaleDateString('en-IN') : '...'} 
                    {' → '}
                    {selectedEnd ? selectedEnd.toLocaleDateString('en-IN') : '...'}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleApply}
                  disabled={!selectedStart || !selectedEnd}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 gap-2"
                >
                  <Check className="w-4 h-4" />
                  Apply Range
                </Button>
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
