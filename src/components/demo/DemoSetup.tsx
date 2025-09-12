import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Play, Eye, Settings, CheckCircle } from "lucide-react";

export function DemoSetup() {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const setupDemoAccount = async () => {
    setIsSettingUp(true);
    
    try {
      // Sign up the demo user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: 'demo@bravoservice.com',
        password: 'Demo123!',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: 'Demo Owner'
          }
        }
      });

      if (signUpError && signUpError.message !== 'User already registered') {
        throw signUpError;
      }

      // If user already exists, sign them in
      if (signUpError?.message === 'User already registered') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'demo@bravoservice.com',
          password: 'Demo123!'
        });
        
        if (signInError) throw signInError;
      }

      // Link the auth user to our demo organization
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ auth_user_id: authData.user.id })
          .eq('email', 'demo@bravoservice.com');

        if (updateError) {
          console.warn('User linking error:', updateError);
          // Don't throw - user might already be linked
        }
      }

      setIsComplete(true);
      toast({
        title: "Demo Account Ready!",
        description: "You're now logged in as the demo owner. Explore all features.",
      });

      // Refresh the page to show the authenticated state
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error: any) {
      console.error('Demo setup error:', error);
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: error.message || "Failed to set up demo account.",
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Demo Account Ready!</h3>
          <p className="text-muted-foreground mb-4">
            Redirecting you to the dashboard...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <Badge className="w-fit mx-auto mb-4 bg-gradient-primary">Live Demo</Badge>
          <CardTitle className="text-2xl font-bold">
            Bravo Service Suite Demo
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Experience the complete service management platform with realistic demo data
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                What You'll See
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Live customer database</li>
                <li>• Active job tracking</li>
                <li>• Real-time analytics</li>
                <li>• Document management</li>
                <li>• Photo galleries</li>
                <li>• Mobile technician tools</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Demo Data Includes
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 2 Active customers</li>
                <li>• Multiple job statuses</li>
                <li>• Material catalog</li>
                <li>• Vendor database</li>
                <li>• Cost tracking</li>
                <li>• Professional estimates</li>
              </ul>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">Demo Account Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Email:</span>
                <p className="text-muted-foreground">demo@bravoservice.com</p>
              </div>
              <div>
                <span className="font-medium">Password:</span>
                <p className="text-muted-foreground">Demo123!</p>
              </div>
              <div>
                <span className="font-medium">Role:</span>
                <p className="text-muted-foreground">Owner (Full Access)</p>
              </div>
              <div>
                <span className="font-medium">Organization:</span>
                <p className="text-muted-foreground">Bravo Service Demo</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={setupDemoAccount}
            disabled={isSettingUp}
            size="lg"
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {isSettingUp ? 'Setting Up Demo...' : 'Start Live Demo'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            This will create and sign you into a demo account with full access to all features.
            Perfect for showing potential customers the complete platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}