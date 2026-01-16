import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
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

interface DashboardStats {
  totalEstimates: number;
  activeCustomers: number;
  monthlyRevenue: number;
  conversionRate: number;
}

interface RecentEstimate {
  id: string;
  estimate_number: string;
  customer_name: string | null;
  description: string | null;
  total: number | null;
  status: string | null;
  created_at: string;
}

interface MonthlyStats {
  sent: number;
  approved: number;
  pending: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEstimates: 0,
    activeCustomers: 0,
    monthlyRevenue: 0,
    conversionRate: 0
  });
  const [recentEstimates, setRecentEstimates] = useState<RecentEstimate[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    sent: 0,
    approved: 0,
    pending: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch all data in parallel
      const [estimatesResult, customersResult, invoicesResult, recentEstimatesResult] = await Promise.all([
        supabase.from('estimates').select('id, status, total, created_at'),
        supabase.from('customers').select('id'),
        supabase.from('invoices').select('amount, approved, invoice_date').gte('invoice_date', startOfMonth),
        supabase.from('estimates')
          .select('id, estimate_number, customer_name, description, total, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const estimates = estimatesResult.data || [];
      const customers = customersResult.data || [];
      const invoices = invoicesResult.data || [];
      const recent = recentEstimatesResult.data || [];

      // Calculate stats
      const totalEstimates = estimates.length;
      const activeCustomers = customers.length;
      
      // Monthly revenue from approved invoices
      const monthlyRevenue = invoices
        .filter(inv => inv.approved)
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);

      // Conversion rate: approved / (approved + sent + pending)
      const approvedEstimates = estimates.filter(e => e.status === 'approved').length;
      const totalSentOrApproved = estimates.filter(e => 
        e.status === 'approved' || e.status === 'sent' || e.status === 'pending'
      ).length;
      const conversionRate = totalSentOrApproved > 0 
        ? (approvedEstimates / totalSentOrApproved) * 100 
        : 0;

      // This month's estimates
      const thisMonthEstimates = estimates.filter(e => 
        new Date(e.created_at) >= new Date(startOfMonth)
      );
      const monthly = {
        sent: thisMonthEstimates.filter(e => e.status === 'sent').length,
        approved: thisMonthEstimates.filter(e => e.status === 'approved').length,
        pending: thisMonthEstimates.filter(e => e.status === 'pending').length
      };

      setStats({
        totalEstimates,
        activeCustomers,
        monthlyRevenue,
        conversionRate
      });
      setRecentEstimates(recent);
      setMonthlyStats(monthly);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statsCards = [
    {
      title: "Total Estimates",
      value: stats.totalEstimates.toString(),
      icon: FileText,
    },
    {
      title: "Active Customers", 
      value: stats.activeCustomers.toString(),
      icon: Users,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(0)}%`,
      icon: TrendingUp,
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
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => {
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
                      </div>
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Estimates */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Estimates</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate("/estimates")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : recentEstimates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No estimates yet</p>
                    <Button variant="hero" onClick={() => navigate("/estimates/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Estimate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentEstimates.map((estimate) => (
                      <div 
                        key={estimate.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
                        onClick={() => navigate(`/estimates/${estimate.id}`)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{estimate.customer_name || 'No Customer'}</p>
                            <p className="text-sm text-muted-foreground">{estimate.description || 'No description'}</p>
                            <p className="text-xs text-muted-foreground">{estimate.estimate_number} • {formatDate(estimate.created_at)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{estimate.total ? `$${estimate.total.toLocaleString()}` : '$0'}</p>
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
                            {estimate.status === "draft" && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/calculator")}>
                  <Calculator className="h-4 w-4" />
                  Price Calculator
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/customers")}>
                  <Users className="h-4 w-4" />
                  Add Customer
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/pricebooks")}>
                  <FileText className="h-4 w-4" />
                  Price Books
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Estimates Sent</span>
                      <span className="font-semibold">{monthlyStats.sent}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Approved</span>
                      <span className="font-semibold text-accent">{monthlyStats.approved}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <span className="font-semibold text-orange-600">{monthlyStats.pending}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
