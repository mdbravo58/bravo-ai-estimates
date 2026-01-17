import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, Clock, User, MapPin, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { CreateAppointmentDialog } from "@/components/scheduling/CreateAppointmentDialog";

interface Appointment {
  id: string;
  title: string;
  description: string | null;
  service_type: string | null;
  address: string | null;
  start_time: string;
  end_time: string;
  status: string;
  customer: {
    id: string;
    name: string;
  } | null;
  assigned_user: {
    id: string;
    name: string;
  } | null;
}

interface Technician {
  id: string;
  name: string;
  appointmentCount: number;
}

interface Stats {
  today: number;
  week: number;
  completionRate: number;
}

const SchedulingPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [stats, setStats] = useState<Stats>({ today: 0, week: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [ghlConfigured, setGhlConfigured] = useState(false);

  useEffect(() => {
    checkGHLConfiguration();
  }, []);

  useEffect(() => {
    if (date) {
      fetchAppointmentsForDate(date);
    }
  }, [date]);

  useEffect(() => {
    fetchStats();
    fetchTechnicians();
  }, []);

  const checkGHLConfiguration = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('organization_id')
        .eq('auth_user_id', user.id)
        .single();

      if (userData) {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('ghl_location_id, ghl_calendar_id')
          .eq('id', userData.organization_id)
          .single();

        setGhlConfigured(!!orgData?.ghl_location_id && !!orgData?.ghl_calendar_id);
      }
    } catch (error) {
      console.error('Error checking GHL config:', error);
    }
  };

  const fetchAppointmentsForDate = async (selectedDate: Date) => {
    setLoading(true);
    try {
      const dayStart = startOfDay(selectedDate).toISOString();
      const dayEnd = endOfDay(selectedDate).toISOString();

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          title,
          description,
          service_type,
          address,
          start_time,
          end_time,
          status,
          customer:customers(id, name),
          assigned_user:users(id, name)
        `)
        .gte('start_time', dayStart)
        .lte('start_time', dayEnd)
        .order('start_time', { ascending: true });

      if (error) throw error;

      setAppointments((data as unknown as Appointment[]) || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const now = new Date();
      const todayStart = startOfDay(now).toISOString();
      const todayEnd = endOfDay(now).toISOString();
      const weekStart = startOfWeek(now).toISOString();
      const weekEnd = endOfWeek(now).toISOString();

      const [todayResult, weekResult, completedResult] = await Promise.all([
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .gte('start_time', todayStart)
          .lte('start_time', todayEnd),
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .gte('start_time', weekStart)
          .lte('start_time', weekEnd),
        supabase
          .from('appointments')
          .select('id, status', { count: 'exact' })
          .eq('status', 'completed')
          .gte('start_time', weekStart)
          .lte('start_time', weekEnd),
      ]);

      const todayCount = todayResult.count || 0;
      const weekCount = weekResult.count || 0;
      const completedCount = completedResult.count || 0;
      const completionRate = weekCount > 0 ? Math.round((completedCount / weekCount) * 100) : 0;

      setStats({
        today: todayCount,
        week: weekCount,
        completionRate,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const { data: techData, error: techError } = await supabase
        .from('users')
        .select('id, name')
        .in('role', ['technician', 'admin', 'owner', 'manager']);

      if (techError) throw techError;

      if (techData) {
        const now = new Date();
        const todayStart = startOfDay(now).toISOString();
        const todayEnd = endOfDay(now).toISOString();

        const techsWithCounts = await Promise.all(
          techData.map(async (tech) => {
            const { count } = await supabase
              .from('appointments')
              .select('id', { count: 'exact' })
              .eq('assigned_user_id', tech.id)
              .gte('start_time', todayStart)
              .lte('start_time', todayEnd);

            return {
              ...tech,
              appointmentCount: count || 0,
            };
          })
        );

        setTechnicians(techsWithCounts);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const syncFromGHL = async () => {
    if (!ghlConfigured) {
      toast.error("Please configure GHL Calendar ID in Settings > GHL Integration first");
      return;
    }

    setSyncing(true);
    try {
      const startTime = date ? startOfDay(date).getTime() : startOfDay(new Date()).getTime();
      const endTime = date ? endOfDay(date).getTime() : endOfDay(new Date()).getTime();

      const { data, error } = await supabase.functions.invoke('ghl-calendar-sync', {
        body: { startTime, endTime }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(`Synced ${data.appointments?.length || 0} appointments from GHL`);
      fetchAppointmentsForDate(date || new Date());
      fetchStats();
      fetchTechnicians();
    } catch (error: unknown) {
      console.error('Error syncing from GHL:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync from GHL';
      toast.error(errorMessage);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed": 
      case "showed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled": 
      case "noshow": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleAppointmentCreated = () => {
    fetchAppointmentsForDate(date || new Date());
    fetchStats();
    fetchTechnicians();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Scheduling & Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Manage appointments and technician schedules
              {!ghlConfigured && (
                <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                  (GHL Calendar not configured)
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={syncFromGHL}
              disabled={syncing || !ghlConfigured}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              Sync from GHL
            </Button>
            <Button variant="hero" size="lg" onClick={() => setShowNewAppointment(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {!ghlConfigured && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">GHL Calendar Not Configured</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Go to Settings &gt; GHL Integration to set up your Calendar ID for two-way sync.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {date ? format(date, "EEEE, MMMM d, yyyy") : "Today's"} Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for this day</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => setShowNewAppointment(true)}
                    >
                      Schedule one now
                    </Button>
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div key={apt.id} className="border rounded-lg p-4 hover:shadow-card transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {apt.customer?.name || 'Unknown Customer'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {apt.title}
                              {apt.service_type && ` - ${apt.service_type}`}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(apt.start_time), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{apt.assigned_user?.name || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{apt.address || 'No address'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technician Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {technicians.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No technicians found
                    </p>
                  ) : (
                    technicians.map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{tech.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {tech.appointmentCount} appointment{tech.appointmentCount !== 1 ? 's' : ''} today
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View Schedule</Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today's Appointments</span>
                  <span className="font-semibold">{stats.today}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-semibold">{stats.week}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold text-accent">{stats.completionRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateAppointmentDialog
        open={showNewAppointment}
        onOpenChange={setShowNewAppointment}
        onSuccess={handleAppointmentCreated}
        selectedDate={date}
      />
    </Layout>
  );
};

export default SchedulingPage;
