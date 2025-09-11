import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Plus, 
  Camera, 
  MapPin, 
  Play, 
  Square, 
  FileText,
  Package,
  Timer,
  Calendar,
  User
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { TimeEntryDialog } from "@/components/mobile/TimeEntryDialog";
import { MaterialEntryDialog } from "@/components/mobile/MaterialEntryDialog";

interface Job {
  id: string;
  code: string;
  name: string;
  address?: string;
  status: string;
  customer: {
    name: string;
  };
}

interface ActiveTimeEntry {
  id: string;
  job_id: string;
  start_time: string;
  cost_code: {
    code: string;
    name: string;
  };
}

const TechMobilePage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTimeEntry, setActiveTimeEntry] = useState<ActiveTimeEntry | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
    checkActiveTimeEntry();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          customer:customers(name)
        `)
        .in('status', ['scheduled', 'in_progress'])
        .order('start_date', { ascending: true });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkActiveTimeEntry = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          cost_code:cost_codes(code, name)
        `)
        .eq('user_id', user.user.id)
        .is('end_time', null)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setActiveTimeEntry(data);
      }
    } catch (error) {
      console.error('Error checking active time entry:', error);
    }
  };

  const stopTimer = async () => {
    if (!activeTimeEntry) return;

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('time_entries')
        .update({ 
          end_time: now,
          hours: calculateHours(activeTimeEntry.start_time, now)
        })
        .eq('id', activeTimeEntry.id);

      if (error) throw error;

      setActiveTimeEntry(null);
      toast.success('Time entry stopped');
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error('Failed to stop timer');
    }
  };

  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Number(((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2));
  };

  const getElapsedTime = () => {
    if (!activeTimeEntry) return '00:00:00';
    
    const start = new Date(activeTimeEntry.start_time);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold">Tech Mobile</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>

        {/* Active Timer */}
        {activeTimeEntry && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-orange-800">Timer Running</p>
                  <p className="text-sm text-orange-600">
                    {activeTimeEntry.cost_code.name}
                  </p>
                  <p className="text-2xl font-mono font-bold text-orange-800">
                    {getElapsedTime()}
                  </p>
                </div>
                <Button 
                  onClick={stopTimer}
                  variant="destructive"
                  size="lg"
                  className="h-16 w-16 rounded-full"
                >
                  <Square className="h-6 w-6" fill="currentColor" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Jobs */}
        <div>
          <h2 className="text-lg font-semibold mb-4">My Jobs Today</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No jobs assigned today</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="cursor-pointer" onClick={() => setSelectedJob(job)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{job.code}</h3>
                        <p className="text-sm text-muted-foreground">{job.name}</p>
                      </div>
                      <Badge variant={job.status === 'in_progress' ? 'default' : 'secondary'}>
                        {job.status === 'in_progress' ? 'Active' : 'Scheduled'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {job.customer.name}
                      </div>
                      {job.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {job.address}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {selectedJob && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setShowTimeDialog(true)}
                size="lg"
                className="h-20 flex-col"
                disabled={!!activeTimeEntry}
              >
                <Play className="h-6 w-6 mb-2" />
                Start Time
              </Button>
              
              <Button
                onClick={() => setShowMaterialDialog(true)}
                variant="outline"
                size="lg"
                className="h-20 flex-col"
              >
                <Package className="h-6 w-6 mb-2" />
                Add Material
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col"
              >
                <Camera className="h-6 w-6 mb-2" />
                Take Photo
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col"
              >
                <FileText className="h-6 w-6 mb-2" />
                Add Notes
              </Button>
            </div>
          </div>
        )}

        <TimeEntryDialog
          open={showTimeDialog}
          onOpenChange={setShowTimeDialog}
          jobId={selectedJob?.id}
          onTimeStarted={(entry) => {
            setActiveTimeEntry(entry);
            setShowTimeDialog(false);
          }}
        />

        <MaterialEntryDialog
          open={showMaterialDialog}
          onOpenChange={setShowMaterialDialog}
          jobId={selectedJob?.id}
        />
      </div>
    </div>
  );
};

export default TechMobilePage;