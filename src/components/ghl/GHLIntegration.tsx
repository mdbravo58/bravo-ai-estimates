import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Zap, 
  Users, 
  Target, 
  MessageCircle, 
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const GHLIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [pipelineId, setPipelineId] = useState('');
  const [workflowId, setWorkflowId] = useState('');
  const [syncStats, setSyncStats] = useState<any>(null);
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [organizationId, setOrganizationId] = useState<string>('');
  const { toast } = useToast();

  // Fetch organization ID on component mount
  React.useEffect(() => {
    const fetchOrgId = async () => {
      try {
        const { data: orgData, error } = await supabase
          .from('organizations')
          .select('id')
          .maybeSingle();
        
        if (orgData && !error) {
          setOrganizationId(orgData.id);
        }
      } catch (err) {
        console.log('Could not fetch organization ID:', err);
      }
    };
    
    fetchOrgId();
  }, []);

  const handleTestConnection = async () => {
    if (!locationId) {
      toast({
        title: "Error",
        description: "Please enter your GHL Location ID",
        variant: "destructive",
      });
      return;
    }

    if (!tempApiKey) {
      toast({
        title: "Access Token required",
        description: "Paste your GHL sub-account Access Token (JWT) before testing.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionTest(null);

    try {
      console.log('Testing GHL connection...');
      const { data: testResult, error: testError } = await supabase.functions.invoke('ghl-test-connection', {
        body: { locationId, tempApiKey }
      });
      
      console.log('Test connection response:', { testResult, testError });

      if (testError) {
        throw new Error(testError.message);
      }

      setConnectionTest(testResult);
      
      if (testResult.success) {
        toast({
          title: "Success",
          description: testResult.message,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: testResult.troubleshooting || testResult.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Test connection error:', error);
      toast({
        title: "Test Failed",
        description: `Connection test failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleContactSync = async () => {
    if (!locationId) {
      toast({
        title: "Error",
        description: "Please enter your GHL Location ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    let step: 'setup' | 'sync' = 'setup';
    try {
      console.log('Starting GHL contact sync...');
      
      // Ensure user/org exists and get organization id
      console.log('Calling ensure-user-org...');
      const { data: ensured, error: ensureError } = await supabase.functions.invoke('ensure-user-org', {
        body: {}
      });
      
      console.log('ensure-user-org response:', { ensured, ensureError });
      if (ensureError) throw new Error(`Setup failed: ${ensureError.message}`);
      
      const organizationId = ensured?.organizationId;
      if (!organizationId) throw new Error('Organization setup incomplete');

      step = 'sync';
      console.log('Calling ghl-sync-contacts with org:', organizationId);
      const { data, error } = await supabase.functions.invoke('ghl-sync-contacts', {
        body: {
          organizationId,
          locationId: locationId,
          tempApiKey
        }
      });
      
      console.log('ghl-sync-contacts response:', { data, error });

      if (error) throw new Error(`Sync failed: ${error.message}`);

      if (data && data.success === false) {
        const statusInfo = data.status ? ` (HTTP ${data.status})` : '';
        throw new Error(`${data.error || 'Sync failed'}${statusInfo}`);
      }

      setSyncStats(data);
      toast({
        title: "Sync Completed",
        description: data.message,
      });

    } catch (error: any) {
      console.error('Sync error:', error);
      const generic = step === 'setup'
        ? 'Setup failed. Please refresh and try again.'
        : 'Sync failed. Double-check your GHL Location ID and that the GHL API key is set.';
      toast({
        title: step === 'setup' ? 'Setup Failed' : 'Sync Failed',
        description: error?.message || generic,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOpportunity = async (jobId: string) => {
    if (!locationId || !pipelineId) {
      toast({
        title: "Error",
        description: "Please enter Location ID and Pipeline ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('ghl-create-opportunity', {
        body: {
          jobId,
          locationId,
          pipelineId
        }
      });

      if (error) throw error;

      toast({
        title: "Opportunity Created",
        description: "Successfully created opportunity in GoHighLevel",
      });

    } catch (error) {
      console.error('Create opportunity error:', error);
      toast({
        title: "Failed to Create Opportunity",
        description: error.message || "Could not create opportunity in GHL",
        variant: "destructive",
      });
    }
  };

  const handleTriggerWorkflow = async (contactId: string, workflowType: string) => {
    if (!workflowId) {
      toast({
        title: "Error",
        description: "Please enter Workflow ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('ghl-trigger-workflow', {
        body: {
          workflowId,
          contactId,
          customData: {
            trigger_source: 'bravo_service_suite',
            workflow_type: workflowType
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Workflow Triggered",
        description: `Successfully triggered ${workflowType} workflow`,
      });

    } catch (error) {
      console.error('Trigger workflow error:', error);
      toast({
        title: "Failed to Trigger Workflow",
        description: error.message || "Could not trigger workflow in GHL",
        variant: "destructive",
      });
    }
  };

  // Connection status derived from last test
  const connectionStatus = connectionTest ? (connectionTest.success ? 'connected' : 'disconnected') : 'unknown';
  const statusLabel = connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'disconnected' ? 'Not connected' : 'Not tested';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            GoHighLevel Integration
            <Badge 
              variant="outline" 
              className={`ml-2 ${
                connectionStatus === 'connected' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : connectionStatus === 'disconnected'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {statusLabel}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-blue-800 mb-2">📍 How to Find Your GHL Location ID</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>1.</strong> Log into your GoHighLevel account</p>
              <p><strong>2.</strong> Go to Settings → Company → My Info</p>
              <p><strong>3.</strong> Look for "Location ID" or check the URL: gohighlevel.com/v2/location/<span className="font-mono bg-blue-100 px-1 rounded">YOUR_LOCATION_ID</span></p>
              <p><strong>4.</strong> Copy the Location ID and paste it below</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-green-800 mb-2">✅ GHL API Connected</h4>
            <div className="text-sm text-green-700 space-y-2">
              <p><strong>Webhook URL:</strong> https://kgwruguzjidernenftyb.supabase.co/functions/v1/ghl-webhook</p>
              <p><strong>Organization ID:</strong> {organizationId || 'Loading...'}</p>
              <p>Configure this webhook in your GHL account to sync contacts automatically.</p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Connect your service business with GoHighLevel's powerful marketing automation, 
            lead management, and communication tools.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-2">
              <Label htmlFor="locationId">GHL Location ID</Label>
              <Input
                id="locationId"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                placeholder="Enter your GHL Location ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pipelineId">Pipeline ID</Label>
              <Input
                id="pipelineId"
                value={pipelineId}
                onChange={(e) => setPipelineId(e.target.value)}
                placeholder="Enter your GHL Pipeline ID"
                required
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-2">
              <Label htmlFor="tempApiKey">GHL API Key (Access Token)</Label>
              <Input
                id="tempApiKey"
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Paste your GHL Access Token (JWT)"
              />
              <p className="text-xs text-muted-foreground">Use the sub-account Access Token from GHL → Settings → Integrations → Access Tokens.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflowId">Workflow ID</Label>
              <Input
                id="workflowId"
                value={workflowId}
                onChange={(e) => setWorkflowId(e.target.value)}
                placeholder="Enter your Workflow ID"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sync">Contact Sync</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="stats">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sync contacts from your GoHighLevel account to your customer database. 
                This will import all contact details including names, emails, phones, and addresses.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleTestConnection} 
                  disabled={isTestingConnection || !locationId}
                  variant="outline"
                  className="w-full"
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Test GHL Connection
                    </>
                  )}
                </Button>

                {!connectionTest && (
                  <p className="text-xs text-muted-foreground">Tip: If it fails, I’ll show the exact error and API host details here.</p>
                )}
                
                <Button 
                  onClick={handleContactSync} 
                  disabled={isLoading || !locationId}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing Contacts...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Sync Contacts from GHL
                    </>
                  )}
                </Button>
              </div>

              {connectionTest && (
                <div className={`p-4 border rounded-lg ${
                  connectionTest.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {connectionTest.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      connectionTest.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {connectionTest.success ? 'Connection Successful' : 'Connection Failed'}
                    </span>
                  </div>
                  <div className={`text-sm space-y-1 ${
                    connectionTest.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {connectionTest.success ? (
                      <>
                        <p>Status: HTTP {connectionTest.status}</p>
                        <p>Contacts available: {connectionTest.contactsFound}</p>
                        <p>✅ API key and Location ID are working correctly</p>
                      </>
                    ) : (
                      <>
                        <p>Status: HTTP {connectionTest.status}</p>
                        <p>Error: {connectionTest.error}</p>
                        <p>Key used: {connectionTest.usingTempKey ? 'Access Token from field' : 'Server secret (GHL_API_KEY)'}</p>
                        <p className="font-medium">{connectionTest.troubleshooting}</p>
                        {connectionTest.details && (
                          <div className="mt-2">
                            <div className="text-xs font-medium">Details</div>
                            <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                              {typeof connectionTest.details === 'string' 
                                ? connectionTest.details 
                                : JSON.stringify(connectionTest.details, null, 2)}
                            </pre>
                          </div>
                        )}
                        {Array.isArray(connectionTest.accessibleLocations) && connectionTest.accessibleLocations.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs font-medium">Accessible Locations</div>
                            <ul className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto space-y-1">
                              {connectionTest.accessibleLocations.map((loc: any, idx: number) => (
                                <li key={idx}>
                                  <code>{loc.id || loc.locationId}</code>
                                  {loc.name ? ` — ${loc.name}` : ''}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {Array.isArray(connectionTest.hostResults) && (
                          <div className="mt-2">
                            <div className="text-xs font-medium">API Host Results</div>
                            <ul className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto space-y-1">
                              {connectionTest.hostResults.map((r: any, idx: number) => (
                                <li key={idx}>
                                  <div>Host: <code>{r.host}</code></div>
                                  <div>Status: {r.status} {r.statusText}</div>
                                  {r.body?.message && <div>Message: {r.body.message}</div>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {syncStats && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Sync Completed</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>Total contacts processed: {syncStats.totalContacts}</p>
                    <p>New customers created: {syncStats.newCustomers}</p>
                    <p>Existing customers updated: {syncStats.updatedCustomers}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Opportunity Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Automatically create opportunities in GoHighLevel when estimates are generated. 
                Track deal progress and sync status updates between systems.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto-Create Opportunities</p>
                    <p className="text-sm text-muted-foreground">
                      New estimates automatically create GHL opportunities
                    </p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Status Sync</p>
                    <p className="text-sm text-muted-foreground">
                      Estimate status updates sync to deal stages
                    </p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Automation Workflows
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Trigger automated follow-up sequences and nurture campaigns based on 
                customer actions and job status changes.
              </p>
              
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Estimate Follow-up</p>
                    <p className="text-sm text-muted-foreground">
                      Automated sequence for pending estimates
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Job Completion</p>
                    <p className="text-sm text-muted-foreground">
                      Review requests and satisfaction surveys
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Customer Nurture</p>
                    <p className="text-sm text-muted-foreground">
                      Seasonal reminders and service offers
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Integration Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">142</p>
                  <p className="text-sm text-muted-foreground">Contacts Synced</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">28</p>
                  <p className="text-sm text-muted-foreground">Opportunities Created</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">56</p>
                  <p className="text-sm text-muted-foreground">Workflows Triggered</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600">89%</p>
                  <p className="text-sm text-muted-foreground">Sync Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GHLIntegration;