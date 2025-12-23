import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { gstStorage, validateGSTIN, getStateFromGSTIN, type GSTConfig } from '../utils/gst';
import type { Screen } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, AlertCircle, Check } from 'lucide-react';

interface GSTSettingsProps {
  onNavigate: (screen: Screen) => void;
}

export function GSTSettings({ onNavigate }: GSTSettingsProps) {
  const [config, setConfig] = useState<GSTConfig>(gstStorage.getConfig());
  const [gstinError, setGstinError] = useState('');
  const [detectedState, setDetectedState] = useState('');

  useEffect(() => {
    if (config.gstin && config.gstin.length === 15) {
      if (validateGSTIN(config.gstin)) {
        setGstinError('');
        const state = getStateFromGSTIN(config.gstin);
        setDetectedState(state);
        const stateCode = config.gstin.substring(0, 2);
        setConfig(prev => ({ ...prev, stateCode }));
      } else {
        setGstinError('Invalid GSTIN format');
        setDetectedState('');
      }
    } else {
      setGstinError('');
      setDetectedState('');
    }
  }, [config.gstin]);

  const handleSave = () => {
    if (config.enableGST && (!config.gstin || !validateGSTIN(config.gstin))) {
      toast.error('Please enter a valid GSTIN');
      return;
    }

    gstStorage.setConfig(config);
    toast.success('GST settings saved successfully!');
    onNavigate('settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => onNavigate('settings')} className="p-2 hover:bg-white/20 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl">GST Settings</h1>
              <p className="text-sm text-blue-100">Configure GST for your invoices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Enable GST */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg">Enable GST Billing</h2>
              <p className="text-sm text-gray-600">Add GST calculations to your bills</p>
            </div>
            <Switch
              checked={config.enableGST}
              onCheckedChange={(checked) => setConfig({ ...config, enableGST: checked })}
            />
          </div>

          {config.enableGST && (
            <>
              {/* GSTIN Input */}
              <div className="space-y-2 mb-4">
                <Label>GSTIN Number *</Label>
                <Input
                  placeholder="e.g., 07AAAAA1234A1Z5"
                  value={config.gstin}
                  onChange={(e) => setConfig({ ...config, gstin: e.target.value.toUpperCase() })}
                  maxLength={15}
                  className={gstinError ? 'border-red-500' : ''}
                />
                {gstinError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {gstinError}
                  </p>
                )}
                {detectedState && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Valid GSTIN - State: {detectedState}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Format: 2 digits state code + 10 digits PAN + 3 alphanumeric characters
                </p>
              </div>

              {/* Composite Dealer */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3>Composite Dealer</h3>
                  <p className="text-sm text-gray-600">I am registered under composition scheme</p>
                </div>
                <Switch
                  checked={config.isCompositeDealer}
                  onCheckedChange={(checked) => setConfig({ ...config, isCompositeDealer: checked })}
                />
              </div>

              {config.isCompositeDealer && (
                <Alert className="mt-4">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    As a composite dealer, you cannot charge GST on your invoices. This option will disable GST calculations.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </Card>

        {/* Information Card */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            GST Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• CGST & SGST are applicable for intra-state transactions (within the same state)</li>
            <li>• IGST is applicable for inter-state transactions (between different states)</li>
            <li>• You need a valid GSTIN to issue GST invoices</li>
            <li>• Composite dealers pay a fixed tax rate and cannot charge GST on invoices</li>
            <li>• HSN codes can be added to products for detailed tax reporting</li>
          </ul>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-600 to-orange-500"
        >
          Save GST Settings
        </Button>
      </div>
    </div>
  );
}