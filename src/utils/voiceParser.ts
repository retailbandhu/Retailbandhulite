// Voice Input Parser for Retail Bandhu
// Parses natural language like "2 Maggi aur 1 Pepsi"

import type { Product } from '../types';

export interface ParsedItem {
  productName: string;
  quantity: number;
  confidence: number;
}

export interface VoiceCommand {
  type: 'add_item' | 'delete_last' | 'clear_bill' | 'apply_discount' | 'navigate' | 'search' | 'unknown';
  items?: ParsedItem[];
  discount?: number;
  screen?: string;
  query?: string;
  rawText: string;
}

// Cache for product matching to improve performance
const productMatchCache = new Map<string, string>();

/**
 * Parse voice input for billing items
 */
export function parseVoiceInput(text: string, availableProducts: Product[]): VoiceCommand {
  const normalizedText = text.toLowerCase().trim();
  
  // Navigation commands
  if (normalizedText.includes('open') || normalizedText.includes('खोलो') || normalizedText.includes('go to') || normalizedText.includes('जाओ')) {
    const screen = extractScreen(normalizedText);
    if (screen) {
      return { type: 'navigate', screen, rawText: text };
    }
  }
  
  // Search commands
  if (normalizedText.includes('search') || normalizedText.includes('ढूंढो') || normalizedText.includes('खोजो')) {
    const query = extractSearchQuery(normalizedText);
    if (query) {
      return { type: 'search', query, rawText: text };
    }
  }
  
  // Check for voice commands first
  if (normalizedText.includes('delete') || normalizedText.includes('हटा') || normalizedText.includes('remove')) {
    if (normalizedText.includes('last') || normalizedText.includes('आखिरी') || normalizedText.includes('पिछला')) {
      return { type: 'delete_last', rawText: text };
    }
  }
  
  if (normalizedText.includes('clear') || normalizedText.includes('साफ') || normalizedText.includes('खाली')) {
    if (normalizedText.includes('bill') || normalizedText.includes('बिल') || normalizedText.includes('all')) {
      return { type: 'clear_bill', rawText: text };
    }
  }
  
  // Check for discount commands
  const discountMatch = normalizedText.match(/(\d+)\s*(?:percent|%|प्रतिशत|परसेंट)\s*(?:discount|छूट|off)/i);
  if (discountMatch) {
    return { 
      type: 'apply_discount', 
      discount: parseInt(discountMatch[1]),
      rawText: text 
    };
  }
  
  // Parse items
  const items = parseItems(normalizedText, availableProducts);
  
  if (items.length > 0) {
    return { type: 'add_item', items, rawText: text };
  }
  
  return { type: 'unknown', rawText: text };
}

/**
 * Extract screen name from navigation command
 */
function extractScreen(text: string): string | null {
  const screenMap: { [key: string]: string } = {
    'dashboard': 'dashboard',
    'home': 'dashboard',
    'bill': 'billing',
    'billing': 'billing',
    'inventory': 'inventory',
    'stock': 'inventory',
    'customer': 'customers',
    'customers': 'customers',
    'reports': 'reports',
    'settings': 'settings',
    'खाता': 'khata',
    'khata': 'khata',
    'expense': 'expenses',
    'खर्चा': 'expenses'
  };
  
  for (const [keyword, screen] of Object.entries(screenMap)) {
    if (text.includes(keyword)) {
      return screen;
    }
  }
  
  return null;
}

/**
 * Extract search query from command
 */
function extractSearchQuery(text: string): string | null {
  // Remove command words
  const cleaned = text
    .replace(/(?:search|ढूंढो|खोजो)\s+(?:for\s+)?/gi, '')
    .trim();
  
  return cleaned || null;
}

/**
 * Parse items from voice input
 */
function parseItems(text: string, products: Product[]): ParsedItem[] {
  const results: ParsedItem[] = [];
  
  // Common separators in Hinglish
  const separators = /(?:\s+aur\s+|\s+और\s+|\s+and\s+|,|\s+tatha\s+|\s+plus\s+)/i;
  const segments = text.split(separators);
  
  for (const segment of segments) {
    const parsed = parseSegment(segment.trim(), products);
    if (parsed) {
      results.push(parsed);
    }
  }
  
  return results;
}

/**
 * Parse a single segment like "2 Maggi" or "ek Pepsi"
 */
function parseSegment(segment: string, products: Product[]): ParsedItem | null {
  if (!segment) return null;
  
  // Extract quantity
  const quantity = extractQuantity(segment);
  
  // Extract product name
  const productName = extractProductName(segment, products);
  
  if (productName) {
    return {
      productName,
      quantity,
      confidence: 0.85
    };
  }
  
  return null;
}

/**
 * Extract quantity from text
 */
function extractQuantity(text: string): number {
  // Number patterns
  const numberMatch = text.match(/^(\d+)\s+/);
  if (numberMatch) {
    return parseInt(numberMatch[1]);
  }
  
  // Hindi/Hinglish number words
  const hindiNumbers: { [key: string]: number } = {
    'ek': 1, 'एक': 1, 'one': 1,
    'do': 2, 'दो': 2, 'two': 2,
    'teen': 3, 'तीन': 3, 'three': 3,
    'char': 4, 'चार': 4, 'four': 4,
    'panch': 5, 'पांच': 5, 'five': 5,
    'chhe': 6, 'छह': 6, 'six': 6,
    'saat': 7, 'सात': 7, 'seven': 7,
    'aath': 8, 'आठ': 8, 'eight': 8,
    'nau': 9, 'नौ': 9, 'nine': 9,
    'das': 10, 'दस': 10, 'ten': 10,
    'gyarah': 11, 'ग्यारह': 11, 'eleven': 11,
    'barah': 12, 'बारह': 12, 'twelve': 12,
    'bees': 20, 'बीस': 20, 'twenty': 20,
    'pachaas': 50, 'पचास': 50, 'fifty': 50,
    'sau': 100, 'सौ': 100, 'hundred': 100
  };
  
  for (const [word, num] of Object.entries(hindiNumbers)) {
    if (text.toLowerCase().startsWith(word + ' ')) {
      return num;
    }
  }
  
  // Default to 1 if no quantity specified
  return 1;
}

/**
 * Extract product name using fuzzy matching with caching
 */
function extractProductName(text: string, products: Product[]): string | null {
  // Remove quantity prefix
  const cleanedText = text.replace(/^(\d+|ek|do|teen|char|panch|one|two|three|four|five|ek|एक|दो|तीन)\s+/i, '').trim();
  
  if (!cleanedText) return null;
  
  // Check cache first
  const cacheKey = `${cleanedText}_${products.length}`;
  if (productMatchCache.has(cacheKey)) {
    return productMatchCache.get(cacheKey)!;
  }
  
  // Try exact match first
  for (const product of products) {
    if (product.name.toLowerCase() === cleanedText.toLowerCase()) {
      productMatchCache.set(cacheKey, product.name);
      return product.name;
    }
  }
  
  // Try partial match
  for (const product of products) {
    if (product.name.toLowerCase().includes(cleanedText.toLowerCase())) {
      productMatchCache.set(cacheKey, product.name);
      return product.name;
    }
  }
  
  // Try fuzzy match (contains)
  for (const product of products) {
    if (cleanedText.toLowerCase().includes(product.name.toLowerCase())) {
      productMatchCache.set(cacheKey, product.name);
      return product.name;
    }
  }
  
  // Try word-by-word match
  const words = cleanedText.split(/\s+/);
  for (const product of products) {
    const productWords = product.name.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (productWords.some(pw => pw.includes(word.toLowerCase()) || word.toLowerCase().includes(pw))) {
        productMatchCache.set(cacheKey, product.name);
        return product.name;
      }
    }
  }
  
  return null;
}

/**
 * Generate natural language confirmation message
 */
export function generateConfirmationMessage(command: VoiceCommand): string {
  switch (command.type) {
    case 'add_item':
      if (command.items && command.items.length > 0) {
        const itemList = command.items.map(item => 
          `${item.quantity} ${item.productName}`
        ).join(' aur ');
        return `${itemList} add kar raha hoon. Samajh aa gaya!`;
      }
      return 'Samajh aa gaya!';
    
    case 'delete_last':
      return 'Pichla item delete kar raha hoon. Ho gaya!';
    
    case 'clear_bill':
      return 'Pura bill clear kar raha hoon. Ho gaya!';
    
    case 'apply_discount':
      return `${command.discount}% discount laga raha hoon. Ho gaya!`;
    
    case 'navigate':
      return `${command.screen} par ja rahe hain. Ho gaya!`;
    
    case 'search':
      return `${command.query} dhoond rahe hain. Samajh aa gaya!`;
    
    default:
      return 'Samajh nahi aaya. Dobara bolo.';
  }
}

/**
 * Generate toast message
 */
export function generateToastMessage(command: VoiceCommand): string {
  switch (command.type) {
    case 'add_item':
      if (command.items && command.items.length > 0) {
        return `✅ ${command.items.length} item(s) added to cart!`;
      }
      return '✅ Done!';
    
    case 'delete_last':
      return '🗑️ Last item removed!';
    
    case 'clear_bill':
      return '🗑️ Bill cleared!';
    
    case 'apply_discount':
      return `💰 ${command.discount}% discount applied!`;
    
    case 'navigate':
      return `📱 Opening ${command.screen}...`;
    
    case 'search':
      return `🔍 Searching for "${command.query}"...`;
    
    default:
      return '❓ Command not recognized. Try again!';
  }
}

/**
 * Clear product match cache (call when products list changes)
 */
export function clearProductCache() {
  productMatchCache.clear();
}

/**
 * Voice command examples
 */
export const VOICE_EXAMPLES = [
  {
    text: '2 Maggi aur 1 Pepsi',
    description: 'Add multiple items',
    category: 'billing'
  },
  {
    text: 'Ek Coke',
    description: 'Add single item',
    category: 'billing'
  },
  {
    text: 'Delete last item',
    description: 'Remove last item',
    category: 'billing'
  },
  {
    text: '10 percent discount',
    description: 'Apply discount',
    category: 'billing'
  },
  {
    text: 'Clear bill',
    description: 'Clear all items',
    category: 'billing'
  },
  {
    text: 'Open inventory',
    description: 'Navigate to screen',
    category: 'navigation'
  },
  {
    text: 'Search Pepsi',
    description: 'Search products',
    category: 'search'
  }
];