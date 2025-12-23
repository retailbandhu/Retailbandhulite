import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Settings as SettingsIcon, 
  Bell, 
  BellOff, 
  Package,
  TrendingDown,
  ShoppingCart
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { storage } from '../utils/storage';
import type { Screen, Product } from '../types';

interface ReorderAlertsProps {
  onNavigate: (screen: Screen) => void;
}

interface ReorderSettings {
  enabled: boolean;
  defaultThreshold: number;
  autoNotify: boolean;
}

const REORDER_SETTINGS_KEY = 'rb_reorder_settings';

export function ReorderAlerts({ onNavigate }: ReorderAlertsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ReorderSettings>({
    enabled: true,
    defaultThreshold: 10,
    autoNotify: true
  });
  const [customThresholds, setCustomThresholds] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setProducts(storage.getProducts());
    
    // Load settings
    const savedSettings = localStorage.getItem(REORDER_SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load custom thresholds
    const savedThresholds = localStorage.getItem('rb_reorder_thresholds');
    if (savedThresholds) {
      setCustomThresholds(JSON.parse(savedThresholds));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(REORDER_SETTINGS_KEY, JSON.stringify(settings));
    toast.success('Reorder settings saved!');
  };

  const saveThreshold = (productId: string, threshold: number) => {
    const newThresholds = { ...customThresholds, [productId]: threshold };
    setCustomThresholds(newThresholds);
    localStorage.setItem('rb_reorder_thresholds', JSON.stringify(newThresholds));
    toast.success('Threshold updated!');
  };

  const getThreshold = (productId: string): number => {
    return customThresholds[productId] || settings.defaultThreshold;
  };

  const lowStockProducts = products.filter(p => p.stock <= getThreshold(p.id));
  const criticalProducts = products.filter(p => p.stock <= 5);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const generateShoppingList = () => {
    const list = lowStockProducts.map(p => 
      `${p.name} - Current: ${p.stock}, Reorder: ${getThreshold(p.id) * 2} units`
    ).join('\n');
    
    const blob = new Blob([`REORDER SHOPPING LIST\n\nGenerated: ${new Date().toLocaleString()}\n\n${list}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reorder-list-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Shopping list downloaded!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-white/20 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl">Reorder Alerts</h1>
              <p className="text-sm text-blue-100">Never run out of stock</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl">{outOfStockProducts.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Critical Stock</p>
                    <p className="text-2xl">{criticalProducts.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl">{lowStockProducts.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            {lowStockProducts.length > 0 && (
              <div className="flex gap-3">
                <Button 
                  onClick={generateShoppingList}
                  className="bg-gradient-to-r from-blue-600 to-orange-500"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Generate Shopping List
                </Button>
              </div>
            )}

            {/* Products List */}
            <Card className="p-6">
              <h2 className="text-lg mb-4">Products Needing Reorder</h2>
              
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">All products are well stocked!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => {
                    const threshold = getThreshold(product.id);
                    const stockPercentage = (product.stock / threshold) * 100;
                    const urgency = product.stock === 0 ? 'critical' : product.stock <= 5 ? 'high' : 'medium';
                    
                    return (
                      <div key={product.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3>{product.name}</h3>
                              <Badge 
                                variant={urgency === 'critical' ? 'destructive' : 'secondary'}
                                className={urgency === 'high' ? 'bg-orange-100 text-orange-700' : ''}
                              >
                                {urgency === 'critical' ? 'OUT OF STOCK' : urgency === 'high' ? 'CRITICAL' : 'LOW STOCK'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Current Stock: {product.stock} | Reorder at: {threshold}
                            </p>
                          </div>
                          <p className="text-lg">₹{product.price}</p>
                        </div>

                        {/* Stock Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                          <div 
                            className={`h-full transition-all ${
                              urgency === 'critical' ? 'bg-red-600' : 
                              urgency === 'high' ? 'bg-orange-500' : 
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Label className="text-xs">Reorder Threshold</Label>
                            <Input
                              type="number"
                              value={threshold}
                              onChange={(e) => saveThreshold(product.id, parseInt(e.target.value) || 0)}
                              className="h-8 text-sm"
                              min="0"
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            Suggested order: <span className="font-medium">{threshold * 2} units</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Enable Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3>Enable Reorder Alerts</h3>
                    <p className="text-sm text-gray-600">Get notified when stock is low</p>
                  </div>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                  />
                </div>

                {settings.enabled && (
                  <>
                    {/* Default Threshold */}
                    <div>
                      <Label>Default Reorder Threshold</Label>
                      <Input
                        type="number"
                        value={settings.defaultThreshold}
                        onChange={(e) => setSettings({ ...settings, defaultThreshold: parseInt(e.target.value) || 10 })}
                        min="1"
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Alert when stock falls below this number
                      </p>
                    </div>

                    {/* Auto Notify */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3>Auto Notifications</h3>
                        <p className="text-sm text-gray-600">Automatically show alerts on dashboard</p>
                      </div>
                      <Switch
                        checked={settings.autoNotify}
                        onCheckedChange={(checked) => setSettings({ ...settings, autoNotify: checked })}
                      />
                    </div>
                  </>
                )}

                <Button onClick={saveSettings} className="w-full bg-gradient-to-r from-blue-600 to-orange-500">
                  Save Settings
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="mb-3 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-blue-600" />
                Reorder Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Set higher thresholds for fast-moving products</li>
                <li>• Consider supplier lead times when setting thresholds</li>
                <li>• Review and adjust thresholds based on sales patterns</li>
                <li>• Generate shopping lists before placing orders</li>
                <li>• Use custom thresholds for seasonal products</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}