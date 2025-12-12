// GST calculation utilities

export interface GSTConfig {
  gstin: string;
  enableGST: boolean;
  stateCode: string;
  isCompositeDealer: boolean;
}

export interface GSTCalculation {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
}

export interface ProductWithGST {
  id: string;
  name: string;
  price: number;
  quantity: number;
  hsnCode?: string;
  gstRate: number; // 0, 5, 12, 18, 28
}

// Common GST rates in India
export const GST_RATES = [0, 5, 12, 18, 28];

// HSN Code suggestions for common products
export const HSN_CODES = {
  'Food Items': '0000',
  'Beverages': '2202',
  'Tea': '0902',
  'Coffee': '0901',
  'Snacks': '1905',
  'Biscuits': '1905',
  'Noodles': '1902',
  'Oil': '1507',
  'Sugar': '1701',
  'Salt': '2501',
  'Spices': '0904',
  'Rice': '1006',
  'Wheat Flour': '1101',
  'Milk': '0401',
  'Detergent': '3402',
  'Soap': '3401',
  'Toothpaste': '3306',
  'Shampoo': '3305',
  'Stationery': '4820',
  'Electronics': '8517'
};

export function calculateGST(
  items: ProductWithGST[],
  config: GSTConfig,
  isInterState: boolean = false
): GSTCalculation {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;

  if (config.enableGST && !config.isCompositeDealer) {
    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const taxRate = item.gstRate / 100;
      const taxAmount = itemTotal * taxRate;

      if (isInterState) {
        // Inter-state: IGST
        totalIGST += taxAmount;
      } else {
        // Intra-state: CGST + SGST
        totalCGST += taxAmount / 2;
        totalSGST += taxAmount / 2;
      }
    });
  }

  const totalTax = totalCGST + totalSGST + totalIGST;
  const grandTotal = subtotal + totalTax;

  return {
    subtotal,
    cgst: parseFloat(totalCGST.toFixed(2)),
    sgst: parseFloat(totalSGST.toFixed(2)),
    igst: parseFloat(totalIGST.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2))
  };
}

export function validateGSTIN(gstin: string): boolean {
  // GSTIN format: 2 digits state code + 10 digits PAN + 1 digit entity + 1 digit Z + 1 check digit
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
}

export function getStateFromGSTIN(gstin: string): string {
  if (!gstin || gstin.length < 2) return '';
  
  const stateCode = gstin.substring(0, 2);
  const states: { [key: string]: string } = {
    '01': 'Jammu and Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '05': 'Uttarakhand',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '11': 'Sikkim',
    '12': 'Arunachal Pradesh',
    '13': 'Nagaland',
    '14': 'Manipur',
    '15': 'Mizoram',
    '16': 'Tripura',
    '17': 'Meghalaya',
    '18': 'Assam',
    '19': 'West Bengal',
    '20': 'Jharkhand',
    '21': 'Odisha',
    '22': 'Chhattisgarh',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '26': 'Dadra and Nagar Haveli and Daman and Diu',
    '27': 'Maharashtra',
    '29': 'Karnataka',
    '30': 'Goa',
    '31': 'Lakshadweep',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '34': 'Puducherry',
    '35': 'Andaman and Nicobar Islands',
    '36': 'Telangana',
    '37': 'Andhra Pradesh'
  };
  
  return states[stateCode] || 'Unknown';
}

// GST configuration storage
const GST_CONFIG_KEY = 'rb_gst_config';

export const gstStorage = {
  getConfig: (): GSTConfig => {
    const saved = localStorage.getItem(GST_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      gstin: '',
      enableGST: false,
      stateCode: '07',
      isCompositeDealer: false
    };
  },
  setConfig: (config: GSTConfig) => {
    localStorage.setItem(GST_CONFIG_KEY, JSON.stringify(config));
  }
};
