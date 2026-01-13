import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Wrench, 
  Zap, 
  Droplets, 
  Home, 
  Sparkles,
  TrendingUp,
  Calendar,
  CreditCard,
  BarChart3,
  Brain,
  Smartphone,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import bravoLogo from "@/assets/bravo-ai-logo.png";

const industries = [
  { name: "Plumbing", icon: Droplets, gradient: "from-blue-500 to-cyan-500" },
  { name: "HVAC", icon: Zap, gradient: "from-orange-500 to-red-500" },
  { name: "Electrical", icon: Zap, gradient: "from-yellow-500 to-amber-500" },
  { name: "Handyman", icon: Wrench, gradient: "from-slate-500 to-slate-700" },
  { name: "Home Cleaning", icon: Sparkles, gradient: "from-purple-500 to-pink-500" },
  { name: "General Contractor", icon: Home, gradient: "from-emerald-500 to-teal-500" },
];

const stats = [
  { 
    label: "AI-Powered", 
    value: "Smart", 
    description: "Intelligent automation at your fingertips",
    icon: Brain
  },
  { 
    label: "Mobile Ready", 
    value: "100%", 
    description: "Full access for your team in the field",
    icon: Smartphone
  },
  { 
    label: "All-in-One", 
    value: "Complete", 
    description: "Everything you need in one platform",
    icon: Shield
  },
];

const features = [
  {
    title: "Grow Revenue",
    description: "Win more jobs with AI-powered estimates and customer communication",
    icon: TrendingUp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
  },
  {
    title: "Manage Jobs",
    description: "Schedule efficiently, track progress, and impress customers",
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    title: "Get Paid",
    description: "Invoicing, QuickBooks integration, and payment tracking",
    icon: CreditCard,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    title: "Run Your Business",
    description: "Reports, analytics, and performance dashboards",
    icon: BarChart3,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  },
];

const CoverPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={bravoLogo} 
              alt="Bravo AI Systems" 
              className="h-16 md:h-20 object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Everything to run and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                grow your service business
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Save time, earn more, and build a top reputation—all with Bravo Service Suite's AI-powered platform
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-orange-500/25"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => navigate("/ai")}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Explore AI Features
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-blue-200 flex items-center justify-center gap-2">
              <Brain className="h-4 w-4" />
              AI-powered business management
            </p>
          </div>
        </div>
      </section>

      {/* Industry Carousel */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-muted-foreground mb-6 text-sm font-medium uppercase tracking-wider">
            Built for service professionals
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {industries.map((industry) => (
              <button
                key={industry.name}
                onClick={() => navigate("/dashboard")}
                className="flex-shrink-0 snap-start group"
              >
                <div className={`w-40 h-24 rounded-xl bg-gradient-to-br ${industry.gradient} p-4 flex flex-col items-center justify-center gap-2 shadow-lg group-hover:scale-105 transition-transform cursor-pointer`}>
                  <industry.icon className="h-8 w-8 text-white" />
                  <span className="text-white font-medium text-sm">{industry.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-12 text-foreground">
            Trusted by service professionals
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center border-none shadow-lg bg-card">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-4xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-lg font-semibold text-foreground mb-2">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Grow your business, not your to-do list
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to run a successful service business, powered by AI
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of service professionals using Bravo to grow their business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="bg-white text-slate-900 hover:bg-blue-50 font-semibold px-8 py-6 text-lg"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate("/ai")}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Explore AI Features
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoverPage;
