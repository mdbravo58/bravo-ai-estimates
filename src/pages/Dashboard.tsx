import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { KPICard } from "@/components/dashboard/KPICard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ActivityFeed, type ActivityItem } from "@/components/dashboard/ActivityFeed";
import { format, subMonths, startOfMonth } from "date-fns";
import {
  FileText,
  Users,
  Plus,
  DollarSign,
  TrendingUp,
  Briefcase,
  Smartphone,
  Calculator,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Raw data
  const [estimates, setEstimates] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sixMonthsAgo = subMonths(new Date(), 6).toISOString();
      const [estRes, custRes, invRes, jobRes] = await Promise.all([
        supabase.from("estimates").select("id, status, total, created_at, customer_name, estimate_number, description"),
        supabase.from("customers").select("id, name, created_at"),
        supabase.from("invoices").select("id, amount, approved, invoice_date, created_at"),
        supabase.from("jobs").select("id, name, code, status, created_at"),
      ]);
      setEstimates(estRes.data || []);
      setCustomers(custRes.data || []);
      setInvoices(invRes.data || []);
      setJobs(jobRes.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Derived stats ──────────────────────────────────────────

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));

  const thisMonthEstimates = estimates.filter(e => new Date(e.created_at) >= thisMonthStart);
  const lastMonthEstimates = estimates.filter(e => {
    const d = new Date(e.created_at);
    return d >= lastMonthStart && d < thisMonthStart;
  });

  const totalRevenue = invoices
    .filter(inv => inv.approved)
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const thisMonthRevenue = invoices
    .filter(inv => inv.approved && new Date(inv.invoice_date) >= thisMonthStart)
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const lastMonthRevenue = invoices
    .filter(inv => {
      const d = new Date(inv.invoice_date);
      return inv.approved && d >= lastMonthStart && d < thisMonthStart;
    })
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const approvedCount = estimates.filter(e => e.status === "approved").length;
  const actionableCount = estimates.filter(e =>
    ["approved", "sent", "pending"].includes(e.status)
  ).length;
  const conversionRate = actionableCount > 0 ? (approvedCount / actionableCount) * 100 : 0;

  // Sparkline data: estimates per month for last 6 months
  const sparklineEstimates = useMemo(() => {
    const months: { value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const ms = startOfMonth(subMonths(now, i));
      const me = i > 0 ? startOfMonth(subMonths(now, i - 1)) : new Date(now.getFullYear(), now.getMonth() + 1, 1);
      months.push({ value: estimates.filter(e => { const d = new Date(e.created_at); return d >= ms && d < me; }).length });
    }
    return months;
  }, [estimates]);

  const sparklineRevenue = useMemo(() => {
    const months: { value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const ms = startOfMonth(subMonths(now, i));
      const me = i > 0 ? startOfMonth(subMonths(now, i - 1)) : new Date(now.getFullYear(), now.getMonth() + 1, 1);
      months.push({
        value: invoices
          .filter(inv => inv.approved && (() => { const d = new Date(inv.invoice_date); return d >= ms && d < me; })())
          .reduce((s, inv) => s + (inv.amount || 0), 0),
      });
    }
    return months;
  }, [invoices]);

  const trendEstimates = lastMonthEstimates.length > 0
    ? Math.round(((thisMonthEstimates.length - lastMonthEstimates.length) / lastMonthEstimates.length) * 100)
    : thisMonthEstimates.length > 0 ? 100 : 0;

  const trendRevenue = lastMonthRevenue > 0
    ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : thisMonthRevenue > 0 ? 100 : 0;

  // ── Charts data ────────────────────────────────────────────

  const estimatesByMonth = useMemo(() => {
    const data: { month: string; approved: number; sent: number; pending: number; draft: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const ms = startOfMonth(subMonths(now, i));
      const me = i > 0 ? startOfMonth(subMonths(now, i - 1)) : new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const monthEstimates = estimates.filter(e => { const d = new Date(e.created_at); return d >= ms && d < me; });
      data.push({
        month: format(ms, "MMM"),
        approved: monthEstimates.filter(e => e.status === "approved").length,
        sent: monthEstimates.filter(e => e.status === "sent").length,
        pending: monthEstimates.filter(e => e.status === "pending").length,
        draft: monthEstimates.filter(e => e.status === "draft").length,
      });
    }
    return data;
  }, [estimates]);

  const statusBreakdown = useMemo(() => [
    { name: "Approved", value: estimates.filter(e => e.status === "approved").length, color: "hsl(var(--accent))" },
    { name: "Sent", value: estimates.filter(e => e.status === "sent").length, color: "hsl(var(--primary))" },
    { name: "Pending", value: estimates.filter(e => e.status === "pending").length, color: "hsl(38, 92%, 50%)" },
    { name: "Draft", value: estimates.filter(e => e.status === "draft").length, color: "hsl(var(--muted-foreground))" },
  ], [estimates]);

  // ── Activity feed ──────────────────────────────────────────

  const activities: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];

    estimates.slice(0, 20).forEach(e => {
      if (e.status === "approved") {
        items.push({
          id: `ea-${e.id}`,
          type: "estimate_approved",
          title: `Estimate ${e.estimate_number} approved`,
          description: e.customer_name || "Unknown customer",
          timestamp: e.created_at,
        });
      } else {
        items.push({
          id: `ec-${e.id}`,
          type: e.status === "sent" ? "estimate_sent" : "estimate_created",
          title: `Estimate ${e.estimate_number} ${e.status === "sent" ? "sent" : "created"}`,
          description: e.customer_name || "Unknown customer",
          timestamp: e.created_at,
        });
      }
    });

    customers.slice(0, 10).forEach(c => {
      items.push({
        id: `cu-${c.id}`,
        type: "customer_added",
        title: `New customer added`,
        description: c.name,
        timestamp: c.created_at,
      });
    });

    jobs.slice(0, 10).forEach(j => {
      items.push({
        id: `jo-${j.id}`,
        type: "job_created",
        title: `Job ${j.code} created`,
        description: j.name,
        timestamp: j.created_at,
      });
    });

    invoices.slice(0, 10).forEach(inv => {
      items.push({
        id: `iv-${inv.id}`,
        type: "invoice_created",
        title: `Invoice created`,
        description: `$${inv.amount?.toLocaleString() || 0}`,
        timestamp: inv.created_at,
      });
    });

    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15);
  }, [estimates, customers, jobs, invoices]);

  // ── Helpers ────────────────────────────────────────────────

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Welcome back! Here's your business at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="hero" size="default" onClick={() => navigate("/estimates/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Estimate
            </Button>
            <Button variant="outline" size="default" onClick={() => navigate("/jobs")}>
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </Button>
          </div>
        </div>

        {/* KPI Cards with Sparklines */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Estimates"
            value={estimates.length.toString()}
            icon={FileText}
            sparklineData={sparklineEstimates}
            trend={{ value: trendEstimates, label: "vs last month" }}
            loading={loading}
          />
          <KPICard
            title="Customers"
            value={customers.length.toString()}
            icon={Users}
            loading={loading}
          />
          <KPICard
            title="Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            sparklineData={sparklineRevenue}
            trend={{ value: trendRevenue, label: "vs last month" }}
            loading={loading}
          />
          <KPICard
            title="Conversion Rate"
            value={`${conversionRate.toFixed(0)}%`}
            icon={TrendingUp}
            loading={loading}
          />
        </div>

        {/* Charts */}
        <DashboardCharts
          estimatesByMonth={estimatesByMonth}
          statusBreakdown={statusBreakdown}
          loading={loading}
        />

        {/* Bottom Row: Recent Estimates + Activity Feed */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recent Estimates */}
          <div className="lg:col-span-3">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recent Estimates</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate("/estimates")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : estimates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4 text-sm">No estimates yet</p>
                    <Button variant="hero" size="sm" onClick={() => navigate("/estimates/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Estimate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {estimates.slice(0, 6).map((estimate) => (
                      <div
                        key={estimate.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/estimates/${estimate.id}`)}
                      >
                        <div className="min-w-0 flex-1 mr-4">
                          <p className="font-medium text-sm truncate">
                            {estimate.customer_name || "No Customer"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {estimate.estimate_number} • {format(new Date(estimate.created_at), "MMM d")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-sm">
                            {estimate.total ? `$${estimate.total.toLocaleString()}` : "$0"}
                          </p>
                          <span className={`text-xs capitalize ${
                            estimate.status === "approved" ? "text-accent" :
                            estimate.status === "sent" ? "text-primary" :
                            estimate.status === "pending" ? "text-orange-600" :
                            "text-muted-foreground"
                          }`}>
                            {estimate.status || "draft"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed activities={activities} loading={loading} />
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="justify-start" onClick={() => navigate("/jobs")}>
                <Briefcase className="h-4 w-4 mr-2" />
                Job Costing
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/calculator")}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/customers")}>
                <Users className="h-4 w-4 mr-2" />
                Customers
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate("/mobile")}>
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
