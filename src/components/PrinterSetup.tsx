import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Bluetooth, Wifi, Usb, Check, Search, Settings as SettingsIcon, Zap, FileText, AlertCircle, X, ChevronRight, RefreshCw } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface Printer {
  id: string;
  name: string;
  type: 'bluetooth' | 'wifi' | 'usb';
  status: 'connected' | 'available' | 'paired';
  signal?: number;
  model?: string;
  lastUsed?: string;
}

interface PrinterConfig {
  paperSize: '58mm' | '80mm';
  fontSize: 'small' | 'medium' | 'large';
  printLogo: boolean;
  printQR: boolean;
  autoCut: boolean;
  copies: number;
}

interface PrinterSetupProps {
  onNavigate: (screen: Screen) => void;
}

export function PrinterSetup({ onNavigate }: PrinterSetupProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'connected' | 'settings'>('discover');
  const [scanning, setScanning] = useState(false);
  const [availablePrinters, setAvailablePrinters] = useState<Printer[]>([]);
  const [connectedPrinter, setConnectedPrinter] = useState<Printer | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  
  const [config, setConfig] = useState<PrinterConfig>({
    paperSize: '80mm',
    fontSize: 'medium',
    printLogo: true,
    printQR: true,
    autoCut: true,
    copies: 1
  });

  // Load saved printer and config
  useEffect(() => {
    const savedPrinter = localStorage.getItem('rb_connected_printer');
    const savedConfig = localStorage.getItem('rb_printer_config');
    
    if (savedPrinter) {
      setConnectedPrinter(JSON.parse(savedPrinter));
    }
    
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Mock printer discovery
  const mockPrinters: Printer[] = [
    {
      id: 'bt-001',
      name: 'SUNMI V2 Pro',
      type: 'bluetooth',
      status: 'available',
      signal: 85,
      model: 'Thermal Printer 80mm'
    },
    {
      id: 'bt-002',
      name: 'RPP02N',
      type: 'bluetooth',
      status: 'available',
      signal: 72,
      model: 'Portable 58mm'
    },
    {
      id: 'wifi-001',
      name: 'Epson TM-T82',
      type: 'wifi',
      status: 'available',
      signal: 90,
      model: 'Network Printer'
    },
    {
      id: 'bt-003',
      name: 'GOOJPRT PT-210',
      type: 'bluetooth',
      status: 'available',
      signal: 60,
      model: 'Mini Thermal 58mm'
    }
  ];

  const handleScan = () => {
    setScanning(true);
    toast.info('Scanning for printers...');
    
    setTimeout(() => {
      setAvailablePrinters(mockPrinters);
      setScanning(false);
      toast.success(`${mockPrinters.length} printers milein!`);
    }, 2000);
  };

  const handleConnect = (printer: Printer) => {
    toast.info(`Connecting to ${printer.name}...`);
    
    setTimeout(() => {
      const connectedPrinterData = { ...printer, status: 'connected' as const, lastUsed: new Date().toISOString() };
      setConnectedPrinter(connectedPrinterData);
      localStorage.setItem('rb_connected_printer', JSON.stringify(connectedPrinterData));
      toast.success(`${printer.name} connected successfully! ✅`);
      setActiveTab('connected');
    }, 1500);
  };

  const handleDisconnect = () => {
    if (connectedPrinter) {
      toast.info(`Disconnecting ${connectedPrinter.name}...`);
      setTimeout(() => {
        setConnectedPrinter(null);
        localStorage.removeItem('rb_connected_printer');
        toast.success('Printer disconnected');
        setActiveTab('discover');
      }, 500);
    }
  };

  const handleTestPrint = () => {
    if (!connectedPrinter) {
      toast.error('Pehle printer connect karein!');
      return;
    }

    toast.info('Printing test receipt...');
    
    setTimeout(() => {
      toast.success('Test print successful! ✅\nCheck your printer.');
    }, 1500);
  };

  const handleSaveConfig = () => {
    localStorage.setItem('rb_printer_config', JSON.stringify(config));
    toast.success('Printer settings saved!');
    setShowConfig(false);
  };

  const getPrinterIcon = (type: string) => {
    switch (type) {
      case 'bluetooth':
        return <Bluetooth className="w-5 h-5" />;
      case 'wifi':
        return <Wifi className="w-5 h-5" />;
      case 'usb':
        return <Usb className="w-5 h-5" />;
      default:
        return <Printer className="w-5 h-5" />;
    }
  };

  const getSignalColor = (signal: number) => {
    if (signal >= 70) return 'text-green-600';
    if (signal >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('settings')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Connect Printer</h1>
          <div className="w-6" />
        </div>

        <div className="text-center">
          <Printer className="w-12 h-12 text-white mx-auto mb-2" />
          <p className="text-white/90 text-sm">
            {connectedPrinter ? `Connected: ${connectedPrinter.name}` : 'No printer connected'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-6">
        <div className="bg-white rounded-xl shadow-md p-1 grid grid-cols-3 gap-1 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`py-2.5 rounded-lg text-sm transition-all ${
              activeTab === 'discover'
                ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Search className="w-4 h-4 mx-auto mb-1" />
            Discover
          </button>
          <button
            onClick={() => setActiveTab('connected')}
            className={`py-2.5 rounded-lg text-sm transition-all ${
              activeTab === 'connected'
                ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Printer className="w-4 h-4 mx-auto mb-1" />
            Connected
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 rounded-lg text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SettingsIcon className="w-4 h-4 mx-auto mb-1" />
            Settings
          </button>
        </div>

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-4">
            {/* Scan Button */}
            <Button
              onClick={handleScan}
              disabled={scanning}
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Scan for Printers
                </>
              )}
            </Button>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-gray-900 mb-1">Printer Setup Tips</h4>
                  <ul className="text-gray-600 text-sm space-y-1 leading-relaxed">
                    <li>• Bluetooth on karein aur printer nearby rakhein</li>
                    <li>• WiFi printers ke liye same network par rahein</li>
                    <li>• Printer ko pairing mode mein rakhein</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Available Printers */}
            {availablePrinters.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-gray-900">Available Printers ({availablePrinters.length})</h3>
                {availablePrinters.map((printer) => (
                  <div
                    key={printer.id}
                    className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        {getPrinterIcon(printer.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-0.5">{printer.name}</h4>
                        <p className="text-gray-600 text-sm">{printer.model}</p>
                        {printer.signal && (
                          <div className="flex items-center space-x-2 mt-1">
                            <div className={`text-xs ${getSignalColor(printer.signal)}`}>
                              Signal: {printer.signal}%
                            </div>
                            <div className="text-xs text-gray-400">•</div>
                            <div className="text-xs text-gray-500 capitalize">{printer.type}</div>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => handleConnect(printer)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white h-9 px-4"
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!scanning && availablePrinters.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">No Printers Found</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Scan button dabayein printer dhoondhne ke liye
                </p>
              </div>
            )}
          </div>
        )}

        {/* Connected Tab */}
        {activeTab === 'connected' && (
          <div className="space-y-4">
            {connectedPrinter ? (
              <>
                {/* Connected Printer Card */}
                <div className="bg-white rounded-xl shadow-md p-5 border-2 border-green-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                        {getPrinterIcon(connectedPrinter.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-gray-900">{connectedPrinter.name}</h3>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <p className="text-gray-600 text-sm">{connectedPrinter.model}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 text-sm">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Printer Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connection Type:</span>
                      <span className="text-gray-900 capitalize">{connectedPrinter.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600">Ready to Print</span>
                    </div>
                    {connectedPrinter.lastUsed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Used:</span>
                        <span className="text-gray-900">
                          {new Date(connectedPrinter.lastUsed).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleTestPrint}
                      className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-10"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Test Print
                    </Button>
                    <Button
                      onClick={handleDisconnect}
                      className="bg-red-50 text-red-600 hover:bg-red-100 h-10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h4 className="text-gray-900 mb-3">Quick Print Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">Print Last Bill</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">Print Daily Summary</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // No Printer Connected
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Printer className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">No Printer Connected</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Discover tab se printer connect karein
                </p>
                <Button
                  onClick={() => setActiveTab('discover')}
                  className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-10"
                >
                  Go to Discover
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Paper Size */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h4 className="text-gray-900 mb-3">Paper Size</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConfig({ ...config, paperSize: '58mm' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    config.paperSize === '58mm'
                      ? 'border-[#1E88E5] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">📄</div>
                    <div className="text-gray-900">58mm</div>
                    <div className="text-xs text-gray-500">Portable</div>
                  </div>
                </button>
                <button
                  onClick={() => setConfig({ ...config, paperSize: '80mm' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    config.paperSize === '80mm'
                      ? 'border-[#1E88E5] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">📃</div>
                    <div className="text-gray-900">80mm</div>
                    <div className="text-xs text-gray-500">Standard</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h4 className="text-gray-900 mb-3">Font Size</h4>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setConfig({ ...config, fontSize: size })}
                    className={`py-3 rounded-lg border-2 transition-all capitalize ${
                      config.fontSize === size
                        ? 'border-[#1E88E5] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Print Options */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h4 className="text-gray-900 mb-3">Print Options</h4>
              <div className="space-y-3">
                {[
                  { key: 'printLogo' as const, label: 'Print Store Logo', icon: '🏪' },
                  { key: 'printQR' as const, label: 'Print QR Code', icon: '📱' },
                  { key: 'autoCut' as const, label: 'Auto Cut Paper', icon: '✂️' }
                ].map((option) => (
                  <div key={option.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{option.icon}</span>
                      <span className="text-gray-900">{option.label}</span>
                    </div>
                    <button
                      onClick={() => setConfig({ ...config, [option.key]: !config[option.key] })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        config[option.key] ? 'bg-[#1E88E5]' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${
                          config[option.key] ? 'translate-x-6 ml-1' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Number of Copies */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h4 className="text-gray-900 mb-3">Number of Copies</h4>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setConfig({ ...config, copies: Math.max(1, config.copies - 1) })}
                  className="w-12 h-12 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <div className="text-3xl text-gray-900">{config.copies}</div>
                <button
                  onClick={() => setConfig({ ...config, copies: Math.min(5, config.copies + 1) })}
                  className="w-12 h-12 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveConfig}
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
            >
              <Check className="w-5 h-5 mr-2" />
              Save Settings
            </Button>

            {/* Reset Button */}
            <button
              onClick={() => {
                setConfig({
                  paperSize: '80mm',
                  fontSize: 'medium',
                  printLogo: true,
                  printQR: true,
                  autoCut: true,
                  copies: 1
                });
                toast.success('Settings reset to default');
              }}
              className="w-full text-gray-600 text-sm py-2"
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
