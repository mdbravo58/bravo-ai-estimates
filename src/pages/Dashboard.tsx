import { Layout } from "@/components/layout/Layout";
import { EstimateBuilder } from "@/components/estimates/EstimateBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  Calculator, 
  TrendingUp,
  Plus,
  DollarSign,
  Clock,
  CheckCircle,
  Briefcase,
  Smartphone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Estimates",
      value: "156",
      change: "+12%",
      icon: FileText,
    },
    {
      title: "Active Customers", 
      value: "89",
      change: "+8%",
      icon: Users,
    },
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+23%",
      icon: DollarSign,
    },
    {
      title: "Conversion Rate",
      value: "68%",
      change: "+5%",
      icon: TrendingUp,
    },
  ];

  const recentEstimates = [
    {
      id: "EST-001",
      customer: "Sarah Johnson",
      project: "Kitchen Plumbing",
      amount: "$1,425",
      status: "approved",
      date: "2024-01-15"
    },
    {
      id: "EST-002", 
      customer: "Mike Chen",
      project: "HVAC Installation",
      amount: "$3,200",
      status: "pending",
      date: "2024-01-14"
    },
    {
      id: "EST-003",
      customer: "Emma Davis",
      project: "Electrical Repair",
      amount: "$450",
      status: "sent",
      date: "2024-01-13"
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your estimates.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="hero" size="lg" onClick={() => navigate("/estimates/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Estimate
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/jobs")}>
              <Briefcase className="h-4 w-4 mr-2" />
              Job Costing
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/mobile")}>
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="shadow-card hover:shadow-elegant transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-accent font-medium">
                        {stat.change} from last month
                      </p>
                    </div>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Estimates */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Estimates</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEstimates.map((estimate) => (
                    <div 
                      key={estimate.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-card-hover transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{estimate.customer}</p>
                          <p className="text-sm text-muted-foreground">{estimate.project}</p>
                          <p className="text-xs text-muted-foreground">{estimate.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{estimate.amount}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {estimate.status === "approved" && (
                            <span className="inline-flex items-center gap-1 text-xs text-accent">
                              <CheckCircle className="h-3 w-3" />
                              Approved
                            </span>
                          )}
                          {estimate.status === "pending" && (
                            <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                          {estimate.status === "sent" && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                              <Clock className="h-3 w-3" />
                              Sent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/jobs")}>
                  <Briefcase className="h-4 w-4" />
                  Job Costing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4" />
                  Price Calculator
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4" />
                  Add Customer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4" />
                  Load Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimates Sent</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Approved</span>
                    <span className="font-semibold text-accent">16</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending</span>
                    <span className="font-semibold text-orange-600">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
