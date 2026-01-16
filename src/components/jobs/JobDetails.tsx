import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { TimeEntryDialog } from "@/components/mobile/TimeEntryDialog";
import { MaterialEntryDialog } from "@/components/mobile/MaterialEntryDialog";
import { EditJobDialog } from "@/components/jobs/EditJobDialog";
import { JobPLReport } from "@/components/jobs/JobPLReport";

interface JobDetailsProps {
  jobId: string;
}

interface Job {
  id: string;
  code: string;
  name: string;
  description?: string;
  address?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  customer_id: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
}

interface Financials {
  totalCost: number;
  laborCost: number;
  materialCost: number;
  revenue: number;
  margin: number;
  hours: number;
}

const statusConfig = {
  estimate: { label: "Estimate", color: "bg-gray-100 text-gray-800" },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  hold: { label: "On Hold", color: "bg-orange-100 text-orange-800" },
  complete: { label: "Complete", color: "bg-green-100 text-green-800" },
  invoiced: { label: "Invoiced", color: "bg-purple-100 text-purple-800" },
};

export const JobDetails = ({ jobId }: JobDetailsProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [financials, setFinancials] = useState<Financials>({
    totalCost: 0,
    laborCost: 0,
    materialCost: 0,
    revenue: 0,
    margin: 0,
    hours: 0
  });
  
  // Dialog states
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPLReport, setShowPLReport] = useState(false);

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          customer:customers(name, email, phone)
        `)
        .eq('id', jobId)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const fetchFinancials = useCallback(async () => {
    try {
      const [timeResult, materialsResult] = await Promise.all([
        supabase
          .from('time_entries')
          .select('hours, burden_rate')
          .eq('job_id', jobId),
        supabase
          .from('material_lines')
          .select('qty, unit_cost, unit_price')
          .eq('job_id', jobId)
      ]);

      const laborCost = timeResult.data?.reduce((sum, t) => 
        sum + ((t.hours || 0) * (t.burden_rate || 0)), 0) || 0;
      
      const materialCost = materialsResult.data?.reduce((sum, m) => 
        sum + (m.qty * m.unit_cost), 0) || 0;
      
      const revenue = materialsResult.data?.reduce((sum, m) => 
        sum + (m.qty * m.unit_price), 0) || 0;

      const totalHours = timeResult.data?.reduce((sum, t) => 
        sum + (t.hours || 0), 0) || 0;

      const totalCost = laborCost + materialCost;
      const margin = revenue > 0 
        ? ((revenue - totalCost) / revenue * 100) 
        : 0;

      setFinancials({
        totalCost,
        laborCost,
        materialCost,
        revenue,
        margin,
        hours: totalHours
      });
    } catch (error) {
      console.error('Error fetching financials:', error);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      fetchFinancials();
    }
  }, [jobId, fetchJobDetails, fetchFinancials]);

  const handleTimeStarted = () => {
    setShowTimeDialog(false);
    fetchFinancials();
    toast.success('Time entry started');
  };

  const handleMaterialAdded = () => {
    setShowMaterialDialog(false);
    fetchFinancials();
  };

  const handleJobUpdated = () => {
    setShowEditDialog(false);
    fetchJobDetails();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Job not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                {job.code}
                <Badge className={statusConfig[job.status as keyof typeof statusConfig]?.color || "bg-gray-100 text-gray-800"}>
                  {statusConfig[job.status as keyof typeof statusConfig]?.label || job.status}
                </Badge>
              </CardTitle>
              <p className="text-muted-foreground mt-1">{job.name}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{job.customer.name}</span>
              {job.customer.phone && (
                <span className="text-sm text-muted-foreground">
                  • {job.customer.phone}
                </span>
              )}
            </div>
            
            {job.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{job.address}</span>
              </div>
            )}
            
            {(job.start_date || job.end_date) && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {job.start_date && format(new Date(job.start_date), 'MMM d, yyyy')}
                  {job.start_date && job.end_date && ' - '}
                  {job.end_date && format(new Date(job.end_date), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            
            {job.description && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Summary Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-lg font-semibold">${financials.totalCost.toLocaleString()}</p>
              </div>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg font-semibold">${financials.revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Margin</p>
                <p className={`text-lg font-semibold ${financials.margin >= 25 ? 'text-green-600' : financials.margin >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {financials.margin.toFixed(1)}%
                </p>
              </div>
              <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${financials.margin >= 25 ? 'bg-green-500' : financials.margin >= 0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(Math.max(financials.margin, 0), 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="text-lg font-semibold">{financials.hours.toFixed(1)}</p>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="justify-start" onClick={() => setShowTimeDialog(true)}>
              <Clock className="h-4 w-4 mr-2" />
              Add Time Entry
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setShowMaterialDialog(true)}>
              <DollarSign className="h-4 w-4 mr-2" />
              Add Material
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setShowPLReport(true)}>
              <FileText className="h-4 w-4 mr-2" />
              View P&L Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TimeEntryDialog
        open={showTimeDialog}
        onOpenChange={setShowTimeDialog}
        jobId={jobId}
        onTimeStarted={handleTimeStarted}
      />

      <MaterialEntryDialog
        open={showMaterialDialog}
        onOpenChange={(open) => {
          setShowMaterialDialog(open);
          if (!open) fetchFinancials();
        }}
        jobId={jobId}
      />

      <EditJobDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        job={job}
        onJobUpdated={handleJobUpdated}
      />

      <JobPLReport
        open={showPLReport}
        onOpenChange={setShowPLReport}
        jobId={jobId}
        jobCode={job.code}
        jobName={job.name}
      />
    </div>
  );
};