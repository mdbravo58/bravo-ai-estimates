import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Calendar, MapPin, User } from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: string;
  code: string;
  name: string;
  description?: string;
  address?: string;
  status: 'estimate' | 'scheduled' | 'in_progress' | 'hold' | 'complete' | 'invoiced';
  start_date?: string;
  end_date?: string;
  created_at: string;
  customer: {
    name: string;
  };
}

interface JobsListProps {
  status?: 'estimate' | 'scheduled' | 'in_progress' | 'hold' | 'complete' | 'invoiced';
  onJobSelect: (jobId: string) => void;
  selectedJobId?: string | null;
}

const statusConfig = {
  estimate: { label: "Estimate", color: "bg-gray-100 text-gray-800" },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  hold: { label: "On Hold", color: "bg-orange-100 text-orange-800" },
  complete: { label: "Complete", color: "bg-green-100 text-green-800" },
  invoiced: { label: "Invoiced", color: "bg-purple-100 text-purple-800" },
};

export const JobsList = ({ status, onJobSelect, selectedJobId }: JobsListProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [status]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select(`
          *,
          customer:customers(name)
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No jobs found</p>
        {status && <p className="text-sm">No jobs with status: {statusConfig[status].label}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedJobId === job.id 
              ? 'bg-primary/5 border-primary' 
              : 'hover:bg-muted/50'
          }`}
          onClick={() => onJobSelect(job.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">{job.code}</h3>
                <Badge className={statusConfig[job.status].color}>
                  {statusConfig[job.status].label}
                </Badge>
              </div>
              <p className="text-sm font-medium mb-1">{job.name}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {job.customer.name}
                </div>
                {job.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.address}
                  </div>
                )}
                {job.start_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(job.start_date), 'MMM d')}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onJobSelect(job.id);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};