import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
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

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
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
            <Button variant="outline" size="sm">
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
                <p className="text-lg font-semibold">$8,450</p>
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
                <p className="text-lg font-semibold">$12,200</p>
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
                <p className="text-lg font-semibold text-green-600">30.7%</p>
              </div>
              <div className="h-2 w-16 bg-green-100 rounded-full">
                <div className="h-2 w-5 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="text-lg font-semibold">24.5</p>
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
            <Button variant="outline" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Add Time Entry
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Add Material
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              View P&L Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};