import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Database, Check, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { storage } from '../utils/storage';

interface ExportDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'json' | 'csv' | 'pdf';
type ExportData = 'all' | 'products' | 'bills' | 'customers' | 'khata';

export function ExportDataDialog({ isOpen, onClose }: ExportDataDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [selectedData, setSelectedData] = useState<Record<ExportData, boolean>>({
    all: false,
    products: true,
    bills: true,
    customers: true,
    khata: true
  });
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const formats = [
    {
      type: 'json' as ExportFormat,
      icon: Database,
      name: 'JSON',
      description: 'Complete backup with all data',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      type: 'csv' as ExportFormat,
      icon: FileSpreadsheet,
      name: 'CSV',
      description: 'Excel-compatible spreadsheet',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      type: 'pdf' as ExportFormat,
      icon: FileText,
      name: 'PDF',
      description: 'Formatted reports (read-only)',
      color: 'text-red-600 dark:text-red-400'
    }
  ];

  const dataOptions = [
    { key: 'products' as ExportData, label: 'Products & Inventory', count: storage.getProducts().length },
    { key: 'bills' as ExportData, label: 'Bills & Invoices', count: storage.getBills().length },
    { key: 'customers' as ExportData, label: 'Customer Records', count: storage.getCustomers().length },
    { key: 'khata' as ExportData, label: 'Khata Entries', count: storage.getKhataEntries().length }
  ];

  const handleExport = async () => {
    setExporting(true);

    try {
      const exportedData: any = {};

      // Collect selected data
      if (selectedData.all) {
        exportedData.products = storage.getProducts();
        exportedData.bills = storage.getBills();
        exportedData.customers = storage.getCustomers();
        exportedData.khata = storage.getKhataEntries();
      } else {
        if (selectedData.products) exportedData.products = storage.getProducts();
        if (selectedData.bills) exportedData.bills = storage.getBills();
        if (selectedData.customers) exportedData.customers = storage.getCustomers();
        if (selectedData.khata) exportedData.khata = storage.getKhataEntries();
      }

      // Check if any data selected
      if (Object.keys(exportedData).length === 0) {
        toast.error('Please select at least one data type to export');
        setExporting(false);
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `retail-bandhu-export-${timestamp}`;

      // Export based on format
      switch (selectedFormat) {
        case 'json':
          exportAsJSON(exportedData, filename);
          break;
        case 'csv':
          exportAsCSV(exportedData, filename);
          break;
        case 'pdf':
          toast.info('PDF export coming soon!');
          break;
      }

      toast.success('Data exported successfully!');
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const exportAsJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
  };

  const exportAsCSV = (data: any, filename: string) => {
    // Export each data type as separate CSV
    Object.keys(data).forEach(key => {
      const items = data[key];
      if (!items || items.length === 0) return;

      // Get headers from first item
      const headers = Object.keys(items[0]);
      const csvRows = [headers.join(',')];

      // Add data rows
      items.forEach((item: any) => {
        const values = headers.map(header => {
          const value = item[header];
          // Handle values with commas or quotes
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      });

      const csv = csvRows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadBlob(blob, `${filename}-${key}.csv`);
    });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTotalItems = () => {
    let total = 0;
    if (selectedData.all) {
      total = dataOptions.reduce((sum, opt) => sum + opt.count, 0);
    } else {
      dataOptions.forEach(opt => {
        if (selectedData[opt.key]) total += opt.count;
      });
    }
    return total;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Export Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download your data in various formats
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Export Format</Label>
            <div className="grid grid-cols-3 gap-3">
              {formats.map(format => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.type;
                
                return (
                  <button
                    key={format.type}
                    onClick={() => setSelectedFormat(format.type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${format.color}`} />
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      {format.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format.description}
                    </p>
                    {isSelected && (
                      <div className="mt-2">
                        <Check className="w-5 h-5 mx-auto text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Data to Export</Label>
            
            {/* Export All Toggle */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
              <div>
                <Label className="font-semibold text-blue-900 dark:text-blue-100">Export Everything</Label>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Complete backup of all data
                </p>
              </div>
              <Switch
                checked={selectedData.all}
                onCheckedChange={(checked) => {
                  setSelectedData({
                    all: checked,
                    products: checked,
                    bills: checked,
                    customers: checked,
                    khata: checked
                  });
                }}
              />
            </div>

            {/* Individual Options */}
            <div className="space-y-2">
              {dataOptions.map(option => (
                <div
                  key={option.key}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={selectedData[option.key]}
                      onCheckedChange={(checked) => {
                        setSelectedData(prev => ({
                          ...prev,
                          [option.key]: checked,
                          all: false
                        }));
                      }}
                      disabled={selectedData.all}
                    />
                    <div>
                      <Label className="font-medium">{option.label}</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {option.count} items
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {option.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Export Summary
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {getTotalItems()} total items • {selectedFormat.toUpperCase()} format
                </p>
              </div>
              <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={exporting || getTotalItems() === 0}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 gap-2"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
