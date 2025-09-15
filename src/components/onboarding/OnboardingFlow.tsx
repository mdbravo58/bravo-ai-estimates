import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<{ onComplete: () => void; onSkip: () => void }>;
  skippable: boolean;
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Bravo Service Suite",
    description: "Let's get you set up in just a few minutes",
    component: WelcomeStep,
    skippable: false
  },
  {
    id: "company-setup",
    title: "Company Information",
    description: "Tell us about your service business",
    component: CompanySetupStep,
    skippable: false
  },
  {
    id: "first-customer",
    title: "Add Your First Customer",
    description: "Start building your customer database",
    component: FirstCustomerStep,
    skippable: true
  },
  {
    id: "integrations",
    title: "Connect Your Tools",
    description: "Integrate with GoHighLevel, QuickBooks, and more",
    component: IntegrationsStep,
    skippable: true
  },
  {
    id: "mobile-setup",
    title: "Mobile App Setup",
    description: "Get your technicians started with mobile tools",
    component: MobileSetupStep,
    skippable: true
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Welcome to your new service business management platform",
    component: CompleteStep,
    skippable: false
  }
];

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStepComplete = async () => {
    const step = steps[currentStep];
    setCompletedSteps(prev => new Set([...prev, step.id]));
    
    // Save progress to user profile
    try {
      await supabase.from('profiles').upsert({
        user_id: user?.id,
        onboarding_step: step.id,
        onboarding_completed: currentStep === steps.length - 1
      });
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Getting Started</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  {completedSteps.has(step.id) ? (
                    <CheckCircle className="w-8 h-8 text-primary" />
                  ) : index === currentStep ? (
                    <Circle className="w-8 h-8 text-primary fill-primary" />
                  ) : (
                    <Circle className="w-8 h-8 text-muted-foreground" />
                  )}
                  <span className="text-xs mt-1 max-w-20 text-center">
                    {step.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent 
              onComplete={handleStepComplete}
              onSkip={handleStepSkip}
            />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {steps[currentStep].skippable && (
              <Button variant="ghost" onClick={handleStepSkip}>
                Skip for now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
function WelcomeStep({ onComplete }: { onComplete: () => void; onSkip: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">Welcome to the future of service business management!</h3>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Bravo Service Suite helps you manage customers, track jobs, create estimates, 
        and grow your business with powerful AI-driven tools and integrations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold">Customer Management</h4>
          <p className="text-sm text-muted-foreground">Centralized customer database with CRM integration</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold">Job Tracking</h4>
          <p className="text-sm text-muted-foreground">Complete job lifecycle from estimate to completion</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold">AI-Powered Tools</h4>
          <p className="text-sm text-muted-foreground">Smart estimates, analytics, and voice assistance</p>
        </div>
      </div>
      <Button onClick={onComplete} className="mt-6">
        Let's Get Started
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function CompanySetupStep({ onComplete }: { onComplete: () => void; onSkip: () => void }) {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      await supabase.from('organizations').upsert({
        name: companyName,
        // You might want to add industry field to organizations table
      });
      
      toast({
        title: "Company information saved",
        description: "Your company profile has been set up successfully."
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Error saving company information",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-2">Company Name *</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name"
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Industry</label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Select your industry</option>
          <option value="hvac">HVAC</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="handyman">Handyman Services</option>
          <option value="landscaping">Landscaping</option>
          <option value="cleaning">Cleaning Services</option>
          <option value="other">Other</option>
        </select>
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Continue
      </Button>
    </div>
  );
}

function FirstCustomerStep({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  return (
    <div className="text-center space-y-6">
      <p>Add your first customer to get started with job management.</p>
      <div className="flex justify-center space-x-4">
        <Button onClick={onComplete}>Add Customer</Button>
        <Button variant="outline" onClick={onSkip}>Skip for now</Button>
      </div>
    </div>
  );
}

function IntegrationsStep({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  return (
    <div className="text-center space-y-6">
      <p>Connect your existing tools to centralize your workflow.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold">GoHighLevel</h4>
          <p className="text-sm text-muted-foreground">CRM and marketing automation</p>
          <Button variant="outline" className="mt-2">Connect</Button>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold">QuickBooks</h4>
          <p className="text-sm text-muted-foreground">Accounting and invoicing</p>
          <Button variant="outline" className="mt-2">Connect</Button>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={onComplete}>Continue</Button>
        <Button variant="outline" onClick={onSkip}>Skip for now</Button>
      </div>
    </div>
  );
}

function MobileSetupStep({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  return (
    <div className="text-center space-y-6">
      <p>Set up mobile access for your field technicians.</p>
      <div className="p-4 border rounded-lg">
        <h4 className="font-semibold">Mobile Features</h4>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
          <li>• Time tracking</li>
          <li>• Material entry</li>
          <li>• Photo capture</li>
          <li>• Job updates</li>
        </ul>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={onComplete}>Setup Complete</Button>
        <Button variant="outline" onClick={onSkip}>Skip for now</Button>
      </div>
    </div>
  );
}

function CompleteStep({ onComplete }: { onComplete: () => void; onSkip: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold">Congratulations!</h3>
      <p className="text-muted-foreground">
        Your Bravo Service Suite is ready to use. Start managing your service business more efficiently.
      </p>
      <Button onClick={onComplete} className="mt-6">
        Go to Dashboard
      </Button>
    </div>
  );
}

export default OnboardingFlow;