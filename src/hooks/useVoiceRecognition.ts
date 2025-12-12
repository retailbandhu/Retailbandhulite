import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface UseVoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (result: VoiceRecognitionResult) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useVoiceRecognition(options: UseVoiceRecognitionOptions = {}) {
  const {
    language = 'hi-IN',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
    onEnd,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        onResult?.({
          transcript: finalTranscript,
          confidence: event.results[event.results.length - 1][0].confidence,
          isFinal: true,
        });
      }

      setInterimTranscript(interim);
      
      if (interim) {
        onResult?.({
          transcript: interim,
          confidence: 0,
          isFinal: false,
        });
      }
    };

    recognition.onerror = (event: { error: string }) => {
      setIsListening(false);
      onError?.(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      onEnd?.();
    };

    try {
      recognition.start();
    } catch (error) {
      onError?.('Failed to start speech recognition');
    }
  }, [language, continuous, interimResults, onResult, onError, onEnd]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export interface ParsedVoiceItem {
  productName: string;
  quantity: number;
  matchedProduct?: {
    id: string;
    name: string;
    price: number;
  };
}

const hindiNumberMap: Record<string, number> = {
  'ek': 1, 'एक': 1,
  'do': 2, 'दो': 2,
  'teen': 3, 'तीन': 3,
  'char': 4, 'चार': 4,
  'panch': 5, 'पांच': 5,
  'chhah': 6, 'छह': 6,
  'saat': 7, 'सात': 7,
  'aath': 8, 'आठ': 8,
  'nau': 9, 'नौ': 9,
  'das': 10, 'दस': 10,
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
};

export function parseVoiceInput(
  text: string,
  products: { id: string; name: string; price: number }[]
): ParsedVoiceItem[] {
  const items: ParsedVoiceItem[] = [];
  const normalizedText = text.toLowerCase().trim();
  
  const patterns = [
    /(\d+|ek|do|teen|char|panch|chhah|saat|aath|nau|das|one|two|three|four|five|six|seven|eight|nine|ten)\s+(.+?)(?:\s+(?:aur|and|,)|$)/gi,
    /(.+?)\s+(\d+|ek|do|teen|char|panch|chhah|saat|aath|nau|das)\s+(?:piece|pieces|packet|packets)?/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(normalizedText)) !== null) {
      let quantity: number;
      let productName: string;

      if (/^\d+$/.test(match[1])) {
        quantity = parseInt(match[1], 10);
        productName = match[2];
      } else if (hindiNumberMap[match[1].toLowerCase()]) {
        quantity = hindiNumberMap[match[1].toLowerCase()];
        productName = match[2];
      } else {
        productName = match[1];
        if (/^\d+$/.test(match[2])) {
          quantity = parseInt(match[2], 10);
        } else {
          quantity = hindiNumberMap[match[2].toLowerCase()] || 1;
        }
      }

      productName = productName.replace(/\s*(aur|and|,)\s*$/, '').trim();

      const matchedProduct = findBestProductMatch(productName, products);

      if (matchedProduct || productName.length > 1) {
        items.push({
          productName: matchedProduct?.name || productName,
          quantity,
          matchedProduct,
        });
      }
    }
  }

  if (items.length === 0 && normalizedText.length > 1) {
    const matchedProduct = findBestProductMatch(normalizedText, products);
    if (matchedProduct) {
      items.push({
        productName: matchedProduct.name,
        quantity: 1,
        matchedProduct,
      });
    }
  }

  return items;
}

function findBestProductMatch(
  searchTerm: string,
  products: { id: string; name: string; price: number }[]
): { id: string; name: string; price: number } | undefined {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const exactMatch = products.find(p => 
    p.name.toLowerCase() === normalizedSearch
  );
  if (exactMatch) return exactMatch;

  const startsWithMatch = products.find(p => 
    p.name.toLowerCase().startsWith(normalizedSearch) ||
    normalizedSearch.startsWith(p.name.toLowerCase())
  );
  if (startsWithMatch) return startsWithMatch;

  const containsMatch = products.find(p => 
    p.name.toLowerCase().includes(normalizedSearch) ||
    normalizedSearch.includes(p.name.toLowerCase())
  );
  if (containsMatch) return containsMatch;

  const fuzzyMatch = products.find(p => {
    const productWords = p.name.toLowerCase().split(/\s+/);
    const searchWords = normalizedSearch.split(/\s+/);
    return searchWords.some(sw => 
      productWords.some(pw => 
        pw.includes(sw) || sw.includes(pw) ||
        levenshteinDistance(pw, sw) <= 2
      )
    );
  });

  return fuzzyMatch;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
