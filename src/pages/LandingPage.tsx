import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  Calculator, 
  TrendingUp,
  CheckCircle,
  Zap,
  Shield,
  Clock,
  BarChart3,
  ArrowRight,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const features = [
    {
      icon: FileText,
      title: "Professional Estimates",
      description: "Create detailed, professional estimates with customizable templates and automatic calculations."
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Organize customer information, project history, and communication in one centralized location."
    },
    {
      icon: Calculator,
      title: "Smart Pricing",
      description: "Built-in calculators and pricing tools help you quote accurately and competitively."
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Track conversion rates, revenue trends, and business performance with detailed reports."
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Streamline your workflow with quick actions, templates, and automated processes."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security and reliable cloud storage."
    }
  ];

  const benefits = [
    {
      stat: "68%",
      label: "Average Conversion Rate",
      description: "Users see higher quote acceptance rates"
    },
    {
      stat: "45min",
      label: "Time Saved Per Estimate",
      description: "Streamlined process reduces admin work"
    },
    {
      stat: "156+",
      label: "Estimates Created",
      description: "Professionals trust our platform"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Premier Plumbing Solutions",
      content: "This platform has transformed how I create estimates. What used to take hours now takes minutes.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Chen HVAC Services",
      content: "The professional templates and pricing tools have helped me win more jobs and grow my business.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">Bravo Service Suite</span>
          </div>
          <Link to="/auth">
            <Button variant="hero" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            Professional Estimate & 
            <br />
            Quote Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Streamline your home services business with professional estimate tools that help you win more jobs and grow faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From estimate creation to customer management, we've got all the tools to help your business thrive.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="shadow-card hover:shadow-elegant transition-all">
                  <CardHeader>
                    <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Proven Results</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of professionals who are growing their business with our platform.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{benefit.stat}</div>
                <div className="text-lg font-semibold mb-2">{benefit.label}</div>
                <div className="text-muted-foreground">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">What Our Users Say</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of professionals who are already using Bravo Service Suite to grow their business.
          </p>
          <Link to="/auth">
            <Button variant="secondary" size="lg" className="text-lg px-8">
              Start Your Free Trial Today
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 bg-gradient-primary rounded flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold">Bravo Service Suite</span>
          </div>
          <p>&copy; 2024 Bravo Service Suite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;