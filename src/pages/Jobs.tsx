import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { JobsList } from "@/components/jobs/JobsList";
import { JobDetails } from "@/components/jobs/JobDetails";
import { CreateJobDialog } from "@/components/jobs/CreateJobDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, TrendingUp, Clock, DollarSign, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface JobStats {
  activeJobs: number;
  totalRevenue: number;
  avgMargin: number;
  pendingApprovals: { time: number; materials: number };
}

const JobsPage = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [stats, setStats] = useState<JobStats>({
    activeJobs: 0,
    totalRevenue: 0,
    avgMargin: 0,
    pendingApprovals: { time: 0, materials: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobStats();
  }, []);

  const fetchJobStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [jobsResult, timeEntriesResult, materialLinesResult, pendingTimeResult, pendingMaterialsResult] = await Promise.all([
        supabase.from('jobs').select('id, status'),
        supabase.from('time_entries').select('hours, burden_rate, job_id'),
        supabase.from('material_lines').select('qty, unit_cost, unit_price, job_id'),
        supabase.from('time_entries').select('id').eq('approved', false),
        supabase.from('material_lines').select('id').eq('approved', false)
      ]);

      // Count active jobs (in_progress status)
      const activeJobs = jobsResult.data?.filter(j => j.status === 'in_progress').length || 0;

      // Calculate total revenue from materials
      const totalRevenue = materialLinesResult.data?.reduce((sum, m) => 
        sum + (m.qty * m.unit_price), 0) || 0;

      // Calculate total costs
      const laborCost = timeEntriesResult.data?.reduce((sum, t) => 
        sum + ((t.hours || 0) * (t.burden_rate || 0)), 0) || 0;
      const materialCost = materialLinesResult.data?.reduce((sum, m) => 
        sum + (m.qty * m.unit_cost), 0) || 0;
      const totalCost = laborCost + materialCost;

      // Calculate average margin
      const avgMargin = totalRevenue > 0 
        ? ((totalRevenue - totalCost) / totalRevenue * 100) 
        : 0;

      // Count pending approvals
      const pendingTime = pendingTimeResult.data?.length || 0;
      const pendingMaterials = pendingMaterialsResult.data?.length || 0;

      setStats({
        activeJobs,
        totalRevenue,
        avgMargin,
        pendingApprovals: { time: pendingTime, materials: pendingMaterials }
      });
    } catch (error) {
      console.error('Error fetching job stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Active Jobs",
      value: loading ? null : stats.activeJobs.toString(),
      change: "In progress",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: loading ? null : `$${stats.totalRevenue.toLocaleString()}`,
      change: "All jobs",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Avg Margin",
      value: loading ? null : `${stats.avgMargin.toFixed(1)}%`,
      change: stats.avgMargin >= 25 ? "Healthy margin" : "Below target",
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: "Pending Approval",
      value: loading ? null : (stats.pendingApprovals.time + stats.pendingApprovals.materials).toString(),
      change: `${stats.pendingApprovals.time} time, ${stats.pendingApprovals.materials} materials`,
      icon: AlertTriangle,
      color: "text-orange-600"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Job Costing</h1>
            <p className="text-muted-foreground">
              Track costs, revenue, and margins in real-time
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    {stat.value === null ? (
                      <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="complete">Complete</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active" className="mt-4">
                    <JobsList 
                      status="in_progress" 
                      onJobSelect={setSelectedJobId}
                      selectedJobId={selectedJobId}
                    />
                  </TabsContent>
                  <TabsContent value="scheduled" className="mt-4">
                    <JobsList 
                      status="scheduled" 
                      onJobSelect={setSelectedJobId}
                      selectedJobId={selectedJobId}
                    />
                  </TabsContent>
                  <TabsContent value="complete" className="mt-4">
                    <JobsList 
                      status="complete" 
                      onJobSelect={setSelectedJobId}
                      selectedJobId={selectedJobId}
                    />
                  </TabsContent>
                  <TabsContent value="all" className="mt-4">
                    <JobsList 
                      onJobSelect={setSelectedJobId}
                      selectedJobId={selectedJobId}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Job Details */}
          <div>
            {selectedJobId ? (
              <JobDetails jobId={selectedJobId} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a job to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <CreateJobDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </Layout>
  );
};

export default JobsPage;