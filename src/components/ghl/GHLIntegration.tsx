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
  const [locationId, setLocationId] = useState('');
  const [pipelineId, setPipelineId] = useState('');
  const [workflowId, setWorkflowId] = useState('');
  const [syncStats, setSyncStats] = useState<any>(null);
  const { toast } = useToast();

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

      console.log('Calling ghl-sync-contacts with org:', organizationId);
      const { data, error } = await supabase.functions.invoke('ghl-sync-contacts', {
        body: {
          organizationId,
          locationId: locationId
        }
      });
      
      console.log('ghl-sync-contacts response:', { data, error });

      if (error) throw error;

      setSyncStats(data);
      toast({
        title: "Sync Completed",
        description: data.message,
      });

    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync contacts",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            GoHighLevel Integration
            <Badge variant="outline" className="ml-2">Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Connect your service business with GoHighLevel's powerful marketing automation, 
            lead management, and communication tools.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="space-y-2">
              <Label htmlFor="locationId">GHL Location ID</Label>
              <Input
                id="locationId"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                placeholder="Enter your GHL Location ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pipelineId">Pipeline ID</Label>
              <Input
                id="pipelineId"
                value={pipelineId}
                onChange={(e) => setPipelineId(e.target.value)}
                placeholder="Enter your Pipeline ID"
              />
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