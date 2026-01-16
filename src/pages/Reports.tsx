import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Download
} from "lucide-react";

interface KPI {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: any;
}

interface ReportData {
  totalRevenue: number;
  previousRevenue: number;
  activeJobs: number;
  completedJobs: number;
  scheduledJobs: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  totalEstimates: number;
  approvedEstimates: number;
  pendingEstimates: number;
  avgJobValue: number;
}

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const daysAgo = parseInt(dateRange);
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      const previousStartDate = new Date(now.getTime() - daysAgo * 2 * 24 * 60 * 60 * 1000).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch all data in parallel
      const [
        jobsResult, 
        customersResult, 
        invoicesResult, 
        previousInvoicesResult,
        estimatesResult,
        newCustomersResult
      ] = await Promise.all([
        supabase.from('jobs').select('id, status, created_at'),
        supabase.from('customers').select('id, created_at'),
        supabase.from('invoices').select('amount, approved, invoice_date').gte('invoice_date', startDate),
        supabase.from('invoices').select('amount, approved, invoice_date').gte('invoice_date', previousStartDate).lt('invoice_date', startDate),
        supabase.from('estimates').select('id, status, total, created_at').gte('created_at', startDate),
        supabase.from('customers').select('id').gte('created_at', startOfMonth)
      ]);

      const jobs = jobsResult.data || [];
      const customers = customersResult.data || [];
      const invoices = invoicesResult.data || [];
      const previousInvoices = previousInvoicesResult.data || [];
      const estimates = estimatesResult.data || [];
      const newCustomers = newCustomersResult.data || [];

      // Calculate revenue
      const totalRevenue = invoices
        .filter(inv => inv.approved)
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);

      const previousRevenue = previousInvoices
        .filter(inv => inv.approved)
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);

      // Job stats
      const completedJobs = jobs.filter(job => job.status === 'complete').length;
      const activeJobs = jobs.filter(job => job.status === 'in_progress').length;
      const scheduledJobs = jobs.filter(job => job.status === 'scheduled').length;

      // Estimate stats
      const approvedEstimates = estimates.filter(e => e.status === 'approved').length;
      const pendingEstimates = estimates.filter(e => e.status === 'pending').length;

      // Average job value
      const avgJobValue = completedJobs > 0 ? totalRevenue / completedJobs : 0;

      setData({
        totalRevenue,
        previousRevenue,
        activeJobs,
        completedJobs,
        scheduledJobs,
        totalCustomers: customers.length,
        newCustomersThisMonth: newCustomers.length,
        totalEstimates: estimates.length,
        approvedEstimates,
        pendingEstimates,
        avgJobValue
      });

    } catch (error: any) {
      console.error('Error fetching report data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load report data.",
      });
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

  const calculateChange = (current: number, previous: number): { change: string; positive: boolean } => {
    if (previous === 0) {
      return { change: current > 0 ? '+100%' : '0%', positive: current >= 0 };
    }
    const percentChange = ((current - previous) / previous) * 100;
    const sign = percentChange >= 0 ? '+' : '';
    return { 
      change: `${sign}${percentChange.toFixed(1)}%`, 
      positive: percentChange >= 0 
    };
  };

  const getKPIs = (): KPI[] => {
    if (!data) return [];

    const revenueChange = calculateChange(data.totalRevenue, data.previousRevenue);
    const totalJobs = data.completedJobs + data.activeJobs + data.scheduledJobs;
    const completionRate = totalJobs > 0 ? (data.completedJobs / totalJobs) * 100 : 0;

    return [
      {
        title: "Total Revenue",
        value: formatCurrency(data.totalRevenue),
        change: revenueChange.change,
        positive: revenueChange.positive,
        icon: DollarSign
      },
      {
        title: "Active Jobs",
        value: data.activeJobs.toString(),
        change: `${data.scheduledJobs} scheduled`,
        positive: true,
        icon: FileText
      },
      {
        title: "Total Customers",
        value: data.totalCustomers.toString(),
        change: `+${data.newCustomersThisMonth} this month`,
        positive: true,
        icon: Users
      },
      {
        title: "Completion Rate",
        value: `${completionRate.toFixed(1)}%`,
        change: `${data.completedJobs} completed`,
        positive: completionRate >= 50,
        icon: TrendingUp
      },
      {
        title: "Avg Job Value",
        value: formatCurrency(data.avgJobValue),
        change: `${data.completedJobs} jobs`,
        positive: true,
        icon: BarChart3
      },
      {
        title: "Estimates",
        value: data.totalEstimates.toString(),
        change: `${data.approvedEstimates} approved`,
        positive: true,
        icon: FileText
      }
    ];
  };

  const kpis = getKPIs();

  return (
    <Layout>
      <main role="main">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Business Reports</h1>
              <p className="text-muted-foreground">Track your business performance and metrics</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>
              ))
            ) : (
              kpis.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {kpi.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold">{kpi.value}</p>
                            <Badge 
                              variant={kpi.positive ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {kpi.positive ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {kpi.change}
                            </Badge>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Report Sections */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : data && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Period Revenue</span>
                      <span className="font-semibold">{formatCurrency(data.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Previous Period</span>
                      <span className="text-muted-foreground">{formatCurrency(data.previousRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Growth</span>
                      {(() => {
                        const change = calculateChange(data.totalRevenue, data.previousRevenue);
                        return (
                          <Badge className={change.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {change.change}
                          </Badge>
                        );
                      })()}
                    </div>
                    <div className="pt-4">
                      <div className="text-sm text-muted-foreground mb-2">Revenue Sources</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Approved Invoices</span>
                          <span>{formatCurrency(data.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending Estimates</span>
                          <span className="text-muted-foreground">{data.pendingEstimates} pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : data && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Jobs Completed</span>
                      <span className="font-semibold">{data.completedJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Jobs In Progress</span>
                      <span className="text-orange-600 font-semibold">{data.activeJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Jobs Scheduled</span>
                      <span className="text-blue-600 font-semibold">{data.scheduledJobs}</span>
                    </div>
                    <div className="pt-4">
                      <div className="text-sm text-muted-foreground mb-2">Job Status Distribution</div>
                      {(() => {
                        const total = data.completedJobs + data.activeJobs + data.scheduledJobs;
                        if (total === 0) {
                          return <p className="text-muted-foreground text-sm">No jobs yet</p>;
                        }
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Completed</span>
                              <span>{((data.completedJobs / total) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>In Progress</span>
                              <span>{((data.activeJobs / total) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Scheduled</span>
                              <span>{((data.scheduledJobs / total) * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : data && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Customers</span>
                      <span className="font-semibold">{data.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New This Month</span>
                      <span className="text-green-600 font-semibold">{data.newCustomersThisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg Revenue per Customer</span>
                      <span className="text-muted-foreground">
                        {data.totalCustomers > 0 
                          ? formatCurrency(data.totalRevenue / data.totalCustomers)
                          : '$0'
                        }
                      </span>
                    </div>
                    <div className="pt-4">
                      <div className="text-sm text-muted-foreground mb-2">Customer Activity</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Active Estimates</span>
                          <span>{data.pendingEstimates} pending</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Approved Estimates</span>
                          <span>{data.approvedEstimates}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : data && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Gross Revenue</span>
                      <span className="font-semibold">{formatCurrency(data.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Job Value</span>
                      <span className="text-muted-foreground">{formatCurrency(data.avgJobValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Jobs Completed</span>
                      <span className="text-green-600 font-semibold">{data.completedJobs}</span>
                    </div>
                    <div className="pt-4">
                      <div className="text-sm text-muted-foreground mb-2">Estimates Overview</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Estimates</span>
                          <span>{data.totalEstimates}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Approved</span>
                          <span className="text-green-600">{data.approvedEstimates}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending</span>
                          <span className="text-orange-600">{data.pendingEstimates}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ReportsPage;
