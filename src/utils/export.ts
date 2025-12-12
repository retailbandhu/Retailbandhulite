// Data Export/Import functionality

export interface BackupData {
  version: string;
  timestamp: string;
  storeInfo: any;
  products: any[];
  customers: any[];
  parties: any[];
  khataEntries: any[];
  expenses: any[];
  bills: any[];
  settings: any;
}

export function exportToJSON(): BackupData {
  const backup: BackupData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    storeInfo: JSON.parse(localStorage.getItem('rb_store_info') || '{}'),
    products: JSON.parse(localStorage.getItem('rb_products') || '[]'),
    customers: JSON.parse(localStorage.getItem('rb_customers') || '[]'),
    parties: JSON.parse(localStorage.getItem('rb_parties') || '[]'),
    khataEntries: JSON.parse(localStorage.getItem('rb_khata_entries') || '[]'),
    expenses: JSON.parse(localStorage.getItem('rb_expenses') || '[]'),
    bills: JSON.parse(localStorage.getItem('rb_bills') || '[]'),
    settings: {
      gst: JSON.parse(localStorage.getItem('rb_gst_config') || '{}'),
      language: localStorage.getItem('rb_language') || 'hinglish',
      loyalty: JSON.parse(localStorage.getItem('rb_loyalty_config') || '{}')
    }
  };
  
  return backup;
}

export function downloadJSON(data: BackupData, filename: string) {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importFromJSON(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function restoreBackup(backup: BackupData) {
  if (backup.storeInfo) {
    localStorage.setItem('rb_store_info', JSON.stringify(backup.storeInfo));
  }
  if (backup.products) {
    localStorage.setItem('rb_products', JSON.stringify(backup.products));
  }
  if (backup.customers) {
    localStorage.setItem('rb_customers', JSON.stringify(backup.customers));
  }
  if (backup.parties) {
    localStorage.setItem('rb_parties', JSON.stringify(backup.parties));
  }
  if (backup.khataEntries) {
    localStorage.setItem('rb_khata_entries', JSON.stringify(backup.khataEntries));
  }
  if (backup.expenses) {
    localStorage.setItem('rb_expenses', JSON.stringify(backup.expenses));
  }
  if (backup.bills) {
    localStorage.setItem('rb_bills', JSON.stringify(backup.bills));
  }
  if (backup.settings) {
    if (backup.settings.gst) {
      localStorage.setItem('rb_gst_config', JSON.stringify(backup.settings.gst));
    }
    if (backup.settings.language) {
      localStorage.setItem('rb_language', backup.settings.language);
    }
    if (backup.settings.loyalty) {
      localStorage.setItem('rb_loyalty_config', JSON.stringify(backup.settings.loyalty));
    }
  }
}

// Generate Excel-compatible CSV with proper formatting
export function generateExcelCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  // Add BOM for proper Excel UTF-8 support
  const BOM = '\uFEFF';
  const headers = Object.keys(data[0]);
  const csvContent = BOM + [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\r\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
