import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Calendar,
  Download
} from "lucide-react";

interface KPI {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: any;
}

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch various data for reports
      const [jobsResult, customersResult] = await Promise.all([
        supabase.from('jobs').select('*'),
        supabase.from('customers').select('*')
      ]);

      const jobs = jobsResult.data || [];
      const customers = customersResult.data || [];

      // Calculate KPIs
      const totalJobs = jobs.length;
      const completedJobs = jobs.filter(job => job.status === 'complete').length;
      const inProgressJobs = jobs.filter(job => job.status === 'in_progress').length;
      const completionRate = totalJobs > 0 ? (completedJobs / totalJobs * 100) : 0;

      const newKpis: KPI[] = [
        {
          title: "Total Revenue",
          value: "$12,450",
          change: "+15.3%",
          positive: true,
          icon: DollarSign
        },
        {
          title: "Active Jobs",
          value: inProgressJobs.toString(),
          change: "+8.2%", 
          positive: true,
          icon: FileText
        },
        {
          title: "Total Customers",
          value: customers.length.toString(),
          change: "+12.1%",
          positive: true,
          icon: Users
        },
        {
          title: "Completion Rate",
          value: `${completionRate.toFixed(1)}%`,
          change: "-2.4%",
          positive: false,
          icon: TrendingUp
        },
        {
          title: "Avg Job Value",
          value: "$2,890",
          change: "+5.7%",
          positive: true,
          icon: BarChart3
        },
        {
          title: "Monthly Margin",
          value: "28.5%",
          change: "+1.2%",
          positive: true,
          icon: TrendingUp
        }
      ];

      setKpis(newKpis);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
            {kpis.map((kpi, index) => {
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
            })}
          </div>

          {/* Report Sections */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Monthly Revenue</span>
                    <span className="font-semibold">$12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Month</span>
                    <span className="text-muted-foreground">$10,800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth</span>
                    <Badge className="bg-green-100 text-green-800">
                      +15.3%
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Revenue by Service</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Plumbing</span>
                        <span>68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Repairs</span>
                        <span>22%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Installation</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Jobs Completed</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Jobs In Progress</span>
                    <span className="text-orange-600 font-semibold">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Job Duration</span>
                    <span className="text-muted-foreground">3.2 days</span>
                  </div>
                  <div className="pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Job Status Distribution</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Completed</span>
                        <span>60%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress</span>
                        <span>25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scheduled</span>
                        <span>15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Customers</span>
                    <span className="font-semibold">48</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>New This Month</span>
                    <span className="text-green-600 font-semibold">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Repeat Customers</span>
                    <span className="text-muted-foreground">32%</span>
                  </div>
                  <div className="pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Customer Satisfaction</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>5 Star Reviews</span>
                        <span>78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Rating</span>
                        <span>4.6/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Gross Revenue</span>
                    <span className="font-semibold">$12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Costs</span>
                    <span className="text-red-600">$8,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Net Profit</span>
                    <span className="text-green-600 font-semibold">$3,550</span>
                  </div>
                  <div className="pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Expense Breakdown</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Labor</span>
                        <span>45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materials</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overhead</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ReportsPage;