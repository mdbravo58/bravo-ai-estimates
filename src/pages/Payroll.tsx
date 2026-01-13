import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Calculator, 
  Building2, 
  FileCheck, 
  Bell,
  DollarSign,
  Users,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const features = [
  {
    icon: Clock,
    title: "Employee Time Tracking",
    description: "Automatic time tracking with GPS verification and overtime calculations",
  },
  {
    icon: Calculator,
    title: "Automated Calculations",
    description: "Automatic wage calculations, deductions, and tax withholdings",
  },
  {
    icon: Building2,
    title: "Direct Deposit Integration",
    description: "Seamless integration with major banks for direct deposit payments",
  },
  {
    icon: FileCheck,
    title: "Tax Compliance",
    description: "Automatic tax filing, W-2 generation, and compliance reporting",
  },
];

const upcomingFeatures = [
  { icon: Users, text: "Multi-state payroll support" },
  { icon: Calendar, text: "Flexible pay schedules" },
  { icon: DollarSign, text: "Contractor payments (1099)" },
  { icon: Bell, text: "Payroll reminders & alerts" },
];

export default function Payroll() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotifyMe = () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    // In production, this would save to database
    setSubmitted(true);
    toast.success("Thanks! We'll notify you when Payroll launches.");
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Payroll Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Streamline your payroll process with automated time tracking, tax calculations, 
            and direct deposit integration—all built into Bravo AI.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Development Status */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">In Active Development</h2>
                <p className="text-muted-foreground mb-6">
                  Our team is building a comprehensive payroll solution specifically designed 
                  for construction and service businesses. We're focusing on ease of use, 
                  compliance, and seamless integration with your existing workflow.
                </p>
                <div className="space-y-3">
                  {upcomingFeatures.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notification Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Get Notified
                  </CardTitle>
                  <CardDescription>
                    Be the first to know when Payroll Management launches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                        <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-medium">You're on the list!</p>
                      <p className="text-sm text-muted-foreground">
                        We'll email you when Payroll is ready.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button onClick={handleNotifyMe} className="w-full">
                        Notify Me
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Development Timeline</CardTitle>
            <CardDescription>
              Our roadmap to a fully-featured payroll solution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6 relative">
                {[
                  { phase: "Phase 1", title: "Time Tracking Integration", status: "In Progress" },
                  { phase: "Phase 2", title: "Wage Calculations & Deductions", status: "Planned" },
                  { phase: "Phase 3", title: "Direct Deposit & Tax Filing", status: "Planned" },
                  { phase: "Phase 4", title: "Reporting & Analytics", status: "Planned" },
                ].map((item, index) => (
                  <div key={item.phase} className="flex gap-4 items-start ml-4">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center -ml-4 z-10",
                      item.status === "In Progress" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.phase}
                        </span>
                        {item.status === "In Progress" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {item.status}
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
