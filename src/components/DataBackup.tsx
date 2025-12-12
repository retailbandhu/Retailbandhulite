import { ArrowLeft, Download, Upload, FileText, Package, Users, Receipt, AlertCircle, Database, FileJson, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { logger } from '../utils/logger';

interface DataBackupProps {
  onNavigate: (screen: Screen) => void;
}

export function DataBackup({ onNavigate }: DataBackupProps) {
  const handleExportJSON = () => {
    try {
      const backup = storage.exportToJSON();
      storage.downloadJSON(backup, 'retail-bandhu-backup');
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
      logger.error(error);
    }
  };

  const handleExportProductsCSV = () => {
    try {
      const products = storage.getProducts();
      if (products.length === 0) {
        toast.error('No products to export');
        return;
      }
      storage.generateExcelCSV(products, 'products');
      toast.success('Products exported to CSV!');
    } catch (error) {
      toast.error('Failed to export products');
      logger.error(error);
    }
  };

  const handleExportCustomersCSV = () => {
    try {
      const customers = storage.getCustomers();
      if (customers.length === 0) {
        toast.error('No customers to export');
        return;
      }
      storage.generateExcelCSV(customers, 'customers');
      toast.success('Customers exported to CSV!');
    } catch (error) {
      toast.error('Failed to export customers');
      logger.error(error);
    }
  };

  const handleExportBillsCSV = () => {
    try {
      const bills = storage.getBills();
      if (bills.length === 0) {
        toast.error('No bills to export');
        return;
      }
      // Flatten bills for CSV
      const flatBills = bills.map(bill => ({
        billNumber: bill.billNumber,
        date: bill.date,
        customerName: bill.customerName || 'Walk-in',
        totalAmount: bill.total,
        itemCount: bill.items.length,
        paymentMethod: bill.paymentMethod || 'Cash'
      }));
      storage.generateExcelCSV(flatBills, 'bills');
      toast.success('Bills exported to CSV!');
    } catch (error) {
      toast.error('Failed to export bills');
      logger.error(error);
    }
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const backup = await storage.importFromJSON(file);
      
      // Validate backup structure
      if (!backup.version || !backup.timestamp) {
        throw new Error('Invalid backup file format');
      }

      // Confirm before restoring
      if (window.confirm('This will replace all current data. Are you sure you want to continue?')) {
        storage.restoreBackup(backup);
        toast.success('Data restored successfully! Please refresh the page.');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      toast.error('Failed to import data: ' + (error as Error).message);
      logger.error(error);
    } finally {
      event.target.value = ''; // Reset file input
    }
  };

  const dataStats = {
    products: storage.getProducts().length,
    customers: storage.getCustomers().length,
    bills: storage.getBills().length,
    parties: storage.getParties().length,
    khataEntries: storage.getKhataEntries().length,
    expenses: storage.getExpenses().length
  };

  const totalRecords = Object.values(dataStats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('settings')} className="p-2 hover:bg-white/20 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl">Data Backup & Export</h1>
              <p className="text-sm text-blue-100">Secure your business data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Data Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg">Your Data Summary</h2>
              <p className="text-sm text-gray-600">{totalRecords} total records</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-2xl">{dataStats.products}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl">{dataStats.customers}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Bills</p>
              <p className="text-2xl">{dataStats.bills}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Parties</p>
              <p className="text-2xl">{dataStats.parties}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Khata Entries</p>
              <p className="text-2xl">{dataStats.khataEntries}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Expenses</p>
              <p className="text-2xl">{dataStats.expenses}</p>
            </div>
          </div>
        </Card>

        {/* Export Section */}
        <Card className="p-6">
          <h2 className="text-lg mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </h2>

          <div className="space-y-3">
            {/* Full Backup */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FileJson className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3>Full Backup (JSON)</h3>
                    <p className="text-sm text-gray-600">Complete backup of all your data</p>
                  </div>
                </div>
                <Button onClick={handleExportJSON} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <p className="text-xs text-gray-500 ml-11">
                Recommended for complete backup and restore
              </p>
            </div>

            {/* Products CSV */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <h3>Products (CSV)</h3>
                    <p className="text-sm text-gray-600">Export products to Excel/CSV</p>
                  </div>
                </div>
                <Button onClick={handleExportProductsCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <p className="text-xs text-gray-500 ml-11">
                Open in Excel, Google Sheets, or any spreadsheet app
              </p>
            </div>

            {/* Customers CSV */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <h3>Customers (CSV)</h3>
                    <p className="text-sm text-gray-600">Export customer list</p>
                  </div>
                </div>
                <Button onClick={handleExportCustomersCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Bills CSV */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <h3>Bills History (CSV)</h3>
                    <p className="text-sm text-gray-600">Export all bills for accounting</p>
                  </div>
                </div>
                <Button onClick={handleExportBillsCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Import Section */}
        <Card className="p-6">
          <h2 className="text-lg mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import / Restore Data
          </h2>

          <Alert className="mb-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Importing data will replace all current data. Make sure to export a backup first!
            </AlertDescription>
          </Alert>

          <div className="p-4 border-2 border-dashed rounded-lg text-center">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
              id="import-file"
            />
            <label 
              htmlFor="import-file"
              className="cursor-pointer block"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="mb-2">
                Click to select backup file
              </p>
              <p className="text-sm text-gray-500">Only JSON backup files are supported</p>
            </label>
          </div>
        </Card>

        {/* Best Practices */}
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Backup Best Practices
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Export a full backup regularly (at least once a week)</li>
            <li>• Keep multiple backup copies in different locations</li>
            <li>• Export CSV files for easy data analysis in Excel</li>
            <li>• Test your backup by importing it on another device</li>
            <li>• Always backup before making major changes</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}