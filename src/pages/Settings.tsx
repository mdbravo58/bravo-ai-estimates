import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Bell, 
  CreditCard,
  Shield,
  Palette,
  Globe,
  Save,
  Upload,
  X,
  Loader2,
  ImageIcon
} from "lucide-react";

const SettingsPage = () => {
  const { toast } = useToast();
  const { organization, userData, loading, refetch } = useOrganization();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Loading states
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Populate form when organization data loads
  useEffect(() => {
    if (organization) {
      setCompanyName(organization.name || "");
      setCompanyPhone(organization.business_phone || "");
      setCompanyEmail(organization.business_email || "");
      setCompanyAddress(organization.address || "");
      setLogoUrl(organization.logo_url);
      setLogoPreview(organization.logo_url);
    }
  }, [organization]);

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, SVG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    if (!organization?.id) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${organization.id}/logo-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('customer-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('customer-photos')
        .getPublicUrl(fileName);

      setLogoUrl(urlData.publicUrl);
      
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded. Click Save Changes to apply.",
      });
    } catch (error: any) {
      console.error('Logo upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
      // Reset preview on error
      setLogoPreview(organization?.logo_url || null);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveChanges = async () => {
    if (!organization?.id) {
      toast({
        title: "Error",
        description: "No organization found. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: companyName,
          business_phone: companyPhone || null,
          business_email: companyEmail || null,
          address: companyAddress || null,
          logo_url: logoUrl,
        })
        .eq('id', organization.id);

      if (error) throw error;

      await refetch();

      toast({
        title: "Settings saved",
        description: "Your organization settings have been updated.",
      });
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Failed to save",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <main role="main">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Configure your organization and preferences</p>
            </div>
            <Button onClick={handleSaveChanges} disabled={saving || loading}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Settings Menu */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Settings Menu</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Building className="h-4 w-4 mr-2" />
                      Organization
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Palette className="h-4 w-4 mr-2" />
                      Appearance
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/ghl">
                        <Globe className="h-4 w-4 mr-2" />
                        GoHighLevel Integration
                      </a>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Organization Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Organization Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Upload Section */}
                  <div className="space-y-3">
                    <Label>Company Logo</Label>
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                        {uploadingLogo ? (
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingLogo}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {logoPreview ? 'Change Logo' : 'Upload Logo'}
                          </Button>
                          {logoPreview && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={handleRemoveLogo}
                              disabled={uploadingLogo}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG, SVG, or WebP. Max 2MB. Recommended: 200x200px
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/svg+xml,image/webp"
                          onChange={handleLogoSelect}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input 
                        id="company-name" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your company name" 
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company-phone">Phone Number</Label>
                      <Input 
                        id="company-phone" 
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        placeholder="Company phone" 
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="company-email">Email Address</Label>
                    <Input 
                      id="company-email" 
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="Company email" 
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company-address">Business Address</Label>
                    <Input 
                      id="company-address" 
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="Full business address" 
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to view your company profile
                      </p>
                    </div>
                    <Switch defaultChecked disabled={loading} />
                  </div>
                </CardContent>
              </Card>

              {/* User Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Users</p>
                      <p className="text-sm text-muted-foreground">1 of 5 users</p>
                    </div>
                    <Button variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      Invite Users
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{userData?.name || 'Current User'}</p>
                        <p className="text-sm text-muted-foreground">{userData?.email || 'No email'}</p>
                      </div>
                      <Badge className="capitalize">{userData?.role || 'Owner'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates for job status changes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Customer Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when customers take actions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for payment status changes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly business performance reports
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing & Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {organization?.plan || 'Basic'} Plan
                      </p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Plan Features:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Up to 5 users</li>
                      <li>• 150 estimates per month</li>
                      <li>• Basic reporting</li>
                      <li>• Email support</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">Billing History</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">GoHighLevel</p>
                      <p className="text-sm text-muted-foreground">
                        Marketing automation & CRM integration
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/ghl">Configure</a>
                    </Button>
                  </div>

                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">QuickBooks</p>
                      <p className="text-sm text-muted-foreground">
                        Sync invoices and expenses
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        Sync job schedules
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-muted-foreground">
                        Accept online payments
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SettingsPage;
