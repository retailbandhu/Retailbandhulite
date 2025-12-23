import React, { useState } from 'react';
import { Upload, Download, Check, X, AlertCircle, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import type { Product } from '../types';

interface BulkProductImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export function BulkProductImport({ isOpen, onClose, onImport }: BulkProductImportProps) {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const template = `Name,Price,Stock,Category,Barcode,HSN Code
Parle-G Biscuit,10,100,Snacks,8901063100619,19059020
Amul Milk 500ml,25,50,Dairy,8901430001234,04011010
Tata Salt 1kg,20,75,Grocery,8901063108028,25010091
Maggi Noodles,14,120,Instant Food,8901058847529,19023010
Bru Coffee 50g,95,30,Beverages,8901063107915,09012100`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1);

    return rows.map(row => {
      const values = row.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] || '';
      });
      return obj;
    });
  };

  const validateAndConvert = (data: any[]): { products: Product[]; errors: string[] } => {
    const products: Product[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const lineNum = index + 2; // +2 because: 1 for header, 1 for 0-based index

      // Validation
      if (!row.name || row.name.trim() === '') {
        errors.push(`Line ${lineNum}: Product name is required`);
        return;
      }

      const price = parseFloat(row.price);
      if (isNaN(price) || price <= 0) {
        errors.push(`Line ${lineNum}: Invalid price for "${row.name}"`);
        return;
      }

      const stock = parseInt(row.stock);
      if (isNaN(stock) || stock < 0) {
        errors.push(`Line ${lineNum}: Invalid stock for "${row.name}"`);
        return;
      }

      // Create product
      products.push({
        id: `imp-${Date.now()}-${index}`,
        name: row.name.trim(),
        price: price,
        stock: stock,
        category: row.category?.trim() || 'General',
        barcode: row.barcode?.trim() || undefined,
        hsnCode: row['hsn code']?.trim() || undefined,
        gstRate: 18 // Default GST rate
      });
    });

    return { products, errors };
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const data = parseCSV(text);

      if (data.length === 0) {
        toast.error('CSV file is empty or invalid');
        setImporting(false);
        return;
      }

      const { products, errors } = validateAndConvert(data);

      const importResult: ImportResult = {
        success: products.length,
        failed: errors.length,
        errors: errors
      };

      setResult(importResult);

      if (products.length > 0) {
        onImport(products);
        toast.success(`Successfully imported ${products.length} products!`);
      }

      if (errors.length > 0) {
        toast.warning(`${errors.length} products failed validation`);
      }
    } catch (error) {
      toast.error('Failed to parse CSV file');
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bulk Product Import</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Import multiple products at once using CSV file
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">How to import:</h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Download the CSV template below</li>
                  <li>Fill in your product details (don't change the headers)</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review the import results</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Download Template */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">CSV Template</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Download template with sample data
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplate} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          {/* Upload Area */}
          <div
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {dragActive ? 'Drop your CSV file here' : 'Upload CSV File'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" className="gap-2" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  Choose File
                </span>
              </Button>
            </label>
          </div>

          {/* Import Progress */}
          {importing && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Processing your file...</p>
            </div>
          )}

          {/* Import Results */}
          {result && !importing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {result.success}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">Imported</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                        {result.failed}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">Failed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {result.errors.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Validation Errors
                  </h4>
                  <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                    {result.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {result.success > 0 && (
                  <Button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Done
                  </Button>
                )}
                <Button onClick={() => setResult(null)} variant="outline" className="flex-1">
                  Import Another File
                </Button>
              </div>
            </div>
          )}

          {/* CSV Format Guide */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">CSV Format:</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>Product name (required)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span>Number greater than 0 (required)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Stock:</span>
                <span>Whole number (required)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>Product category (optional)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Barcode:</span>
                <span>Product barcode (optional)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">HSN Code:</span>
                <span>GST HSN code (optional)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
