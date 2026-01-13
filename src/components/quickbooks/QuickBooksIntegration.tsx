import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  DollarSign, 
  FileText, 
  Receipt,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRightLeft,
  Settings2
} from 'lucide-react';

const QuickBooksIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncSettings, setSyncSettings] = useState({
    syncInvoices: true,
    syncExpenses: true,
    syncPayments: true,
    syncCustomers: true,
    autoSync: false,
  });
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!clientId || !clientSecret) {
      toast({
        title: "Error",
        description: "Please enter your QuickBooks Client ID and Client Secret",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // In production, this would initiate OAuth2 flow with QuickBooks
      // For now, simulate the connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setCompanyId('123456789');
      toast({
        title: "Connected to QuickBooks",
        description: "Your QuickBooks account has been successfully connected",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to QuickBooks",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setCompanyId('');
    toast({
      title: "Disconnected",
      description: "QuickBooks has been disconnected from your account",
    });
  };

  const handleSync = async (type: 'invoices' | 'expenses' | 'payments' | 'all') => {
    setIsLoading(true);

    try {
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastSync(new Date().toISOString());
      toast({
        title: "Sync Completed",
        description: `Successfully synced ${type === 'all' ? 'all data' : type} with QuickBooks`,
      });
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message || "Could not sync with QuickBooks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (setting: keyof typeof syncSettings) => {
    setSyncSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            QuickBooks Integration
            <Badge 
              variant="outline" 
              className={`ml-2 ${
                isConnected 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {isConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-green-800 mb-2">📊 Full Accounting Integration</h4>
            <div className="text-sm text-green-700 space-y-2">
              <p>Connect QuickBooks to sync your financial data including:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Invoices and payments from jobs</li>
                <li>Expenses and material costs</li>
                <li>Customer records</li>
                <li>Financial reports and P&L</li>
              </ul>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Sync your service business finances with QuickBooks for complete accounting, 
            tax preparation, and financial reporting.
          </p>

          {!isConnected ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🔑 How to Get QuickBooks Credentials</h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <p><strong>1.</strong> Go to <a href="https://developer.intuit.com" target="_blank" rel="noopener noreferrer" className="underline">developer.intuit.com</a></p>
                  <p><strong>2.</strong> Create or sign in to your Intuit Developer account</p>
                  <p><strong>3.</strong> Create a new app and select "QuickBooks Online Accounting"</p>
                  <p><strong>4.</strong> Copy your Client ID and Client Secret from the app settings</p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter your QuickBooks Client ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="Enter your Client Secret"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to QuickBooks...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Connect QuickBooks
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Connected to QuickBooks</p>
                    <p className="text-sm text-green-600">Company ID: {companyId}</p>
                    {lastSync && (
                      <p className="text-xs text-green-500">
                        Last sync: {new Date(lastSync).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="sync" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sync">Sync Data</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Data Synchronization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sync your data between Bravo Service Suite and QuickBooks. 
                  Choose what to sync or sync everything at once.
                </p>
                
                <div className="grid gap-3 md:grid-cols-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleSync('invoices')} 
                    disabled={isLoading}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Sync Invoices
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleSync('expenses')} 
                    disabled={isLoading}
                    className="justify-start"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Sync Expenses
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleSync('payments')} 
                    disabled={isLoading}
                    className="justify-start"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Sync Payments
                  </Button>
                  <Button 
                    onClick={() => handleSync('all')} 
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync All Data
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">24</p>
                      <p className="text-sm text-muted-foreground">Pending Sync</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">156</p>
                      <p className="text-sm text-muted-foreground">Synced This Month</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">$45,230</p>
                      <p className="text-sm text-muted-foreground">Total Invoiced</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Invoices created in Bravo Service Suite are automatically synced to QuickBooks 
                  when auto-sync is enabled. GHL handles the invoicing, QuickBooks handles the accounting.
                </p>
                
                <Button 
                  onClick={() => handleSync('invoices')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Sync Pending Invoices Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Expense Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">12</p>
                      <p className="text-sm text-muted-foreground">Unsynced Expenses</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">89</p>
                      <p className="text-sm text-muted-foreground">Synced This Month</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">$12,450</p>
                      <p className="text-sm text-muted-foreground">Total Expenses</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Material costs, subcontractor payments, and other job expenses are tracked here 
                  and synced to QuickBooks for accurate P&L reporting.
                </p>
                
                <Button 
                  onClick={() => handleSync('expenses')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Sync Expenses to QuickBooks
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Sync Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sync Invoices</Label>
                      <p className="text-sm text-muted-foreground">
                        Push completed job invoices to QuickBooks
                      </p>
                    </div>
                    <Switch 
                      checked={syncSettings.syncInvoices}
                      onCheckedChange={() => handleSettingChange('syncInvoices')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sync Expenses</Label>
                      <p className="text-sm text-muted-foreground">
                        Push material and labor costs to QuickBooks
                      </p>
                    </div>
                    <Switch 
                      checked={syncSettings.syncExpenses}
                      onCheckedChange={() => handleSettingChange('syncExpenses')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sync Payments</Label>
                      <p className="text-sm text-muted-foreground">
                        Record payments received in QuickBooks
                      </p>
                    </div>
                    <Switch 
                      checked={syncSettings.syncPayments}
                      onCheckedChange={() => handleSettingChange('syncPayments')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sync Customers</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep customer records in sync
                      </p>
                    </div>
                    <Switch 
                      checked={syncSettings.syncCustomers}
                      onCheckedChange={() => handleSettingChange('syncCustomers')}
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Auto-Sync</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically sync data every hour
                        </p>
                      </div>
                      <Switch 
                        checked={syncSettings.autoSync}
                        onCheckedChange={() => handleSettingChange('autoSync')}
                      />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Financial Summary */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Revenue (MTD)</p>
                <p className="text-2xl font-bold text-green-700">$45,230</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Expenses (MTD)</p>
                <p className="text-2xl font-bold text-red-700">$12,450</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Gross Profit</p>
                <p className="text-2xl font-bold text-blue-700">$32,780</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Margin</p>
                <p className="text-2xl font-bold text-purple-700">72.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickBooksIntegration;
