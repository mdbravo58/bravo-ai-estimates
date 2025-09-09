import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Download,
  MessageSquare,
  Star,
  Shield
} from "lucide-react";

interface EstimateData {
  id: string;
  title: string;
  description: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    unitCost: number;
    total: number;
  }>;
  packages: Array<{
    tier: "good" | "better" | "best";
    title: string;
    price: number;
    features: string[];
    recommended?: boolean;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "approved" | "paid";
  validUntil: string;
  organization: {
    name: string;
    logo?: string;
    phone: string;
    email: string;
  };
}

const mockEstimate: EstimateData = {
  id: "EST-2024-001",
  title: "Kitchen Plumbing Installation",
  description: "Complete kitchen plumbing upgrade including new fixtures, pipes, and disposal unit installation.",
  customer: {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    address: "123 Oak Street, Springfield, IL 62701"
  },
  items: [
    {
      name: "Kitchen Sink Installation",
      description: "Remove old sink and install new undermount stainless steel sink",
      quantity: 1,
      unitCost: 450,
      total: 450
    },
    {
      name: "Garbage Disposal Unit",
      description: "InSinkErator Evolution Excel 1HP disposal with installation",
      quantity: 1,
      unitCost: 380,
      total: 380
    },
    {
      name: "Water Supply Lines",
      description: "Replace old supply lines with new braided stainless steel lines",
      quantity: 2,
      unitCost: 75,
      total: 150
    },
    {
      name: "Labor - Installation",
      description: "Professional installation and testing (4 hours)",
      quantity: 4,
      unitCost: 85,
      total: 340
    }
  ],
  packages: [
    {
      tier: "good",
      title: "Essential Package",
      price: 1320,
      features: [
        "Standard sink installation",
        "Basic disposal unit",
        "Standard supply lines",
        "1-year warranty"
      ]
    },
    {
      tier: "better",
      title: "Professional Package",
      price: 1650,
      features: [
        "Premium sink installation",
        "High-efficiency disposal",
        "Braided steel supply lines",
        "Water filtration system",
        "2-year warranty"
      ],
      recommended: true
    },
    {
      tier: "best",
      title: "Premium Package",
      price: 2100,
      features: [
        "Luxury sink installation",
        "Premium 1HP disposal",
        "Premium supply lines",
        "Advanced filtration system",
        "Smart leak detection",
        "5-year warranty"
      ]
    }
  ],
  subtotal: 1320,
  tax: 105.60,
  total: 1425.60,
  status: "sent",
  validUntil: "2024-02-15",
  organization: {
    name: "Premier Plumbing Solutions",
    phone: "(555) 123-4567",
    email: "info@premierplumbing.com"
  }
};

export function CustomerPortal() {
  const estimate = mockEstimate;

  const handleApprovePackage = (packageTier: string) => {
    console.log(`Approved package: ${packageTier}`);
    // Here you would handle the approval logic
  };

  const handlePayDeposit = () => {
    console.log("Initiating payment...");
    // Here you would integrate with Stripe
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-primary">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-semibold">
                  {estimate.organization.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Estimate #{estimate.id}
                </p>
              </div>
            </div>
            <Badge 
              variant={estimate.status === "sent" ? "secondary" : "default"}
              className="capitalize"
            >
              {estimate.status}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{estimate.title}</h3>
                    <p className="text-muted-foreground mt-1">{estimate.description}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <span className="font-medium">Customer:</span>
                      <p className="text-muted-foreground">{estimate.customer.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-muted-foreground">{estimate.customer.address}</p>
                    </div>
                    <div>
                      <span className="font-medium">Valid Until:</span>
                      <p className="text-muted-foreground">{new Date(estimate.validUntil).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Estimate ID:</span>
                      <p className="text-muted-foreground">{estimate.id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Selection */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Choose Your Package</CardTitle>
                <p className="text-muted-foreground">
                  Select the package that best fits your needs and budget.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {estimate.packages.map((pkg) => (
                    <div 
                      key={pkg.tier}
                      className={`relative border rounded-lg p-6 transition-all hover:shadow-elegant ${
                        pkg.recommended ? 'border-primary bg-primary-light' : ''
                      }`}
                    >
                      {pkg.recommended && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-primary">
                            <Star className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h3 className="font-semibold text-lg capitalize">{pkg.tier}</h3>
                        <p className="font-medium text-sm text-muted-foreground">{pkg.title}</p>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">${pkg.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        variant={pkg.recommended ? "hero" : "outline"}
                        className="w-full"
                        onClick={() => handleApprovePackage(pkg.tier)}
                      >
                        Select {pkg.tier}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estimate.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.unitCost}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">${item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="hero" className="w-full" onClick={handlePayDeposit}>
                  <CreditCard className="h-4 w-4" />
                  Pay Deposit (50%)
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4" />
                  Message Provider
                </Button>
              </CardContent>
            </Card>

            {/* Estimate Summary */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle>Estimate Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${estimate.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${estimate.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${estimate.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Why Choose Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>15+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Satisfaction Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span>Emergency Service Available</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Phone:</span>
                  <p className="text-muted-foreground">{estimate.organization.phone}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-muted-foreground">{estimate.organization.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}