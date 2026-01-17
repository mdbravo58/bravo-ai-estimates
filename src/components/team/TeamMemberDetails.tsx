import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mail, Phone, Briefcase, Clock, Calendar, Star, 
  Pencil, MessageSquare, MapPin, DollarSign 
} from "lucide-react";
import { format } from "date-fns";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  job_title: string | null;
  hourly_rate: number | null;
  status: string;
  created_at: string;
}

interface TeamMemberDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onEdit: () => void;
}

interface Stats {
  hoursThisMonth: number;
  jobsCompleted: number;
  avgRating: number;
  appointmentsToday: number;
}

interface RecentActivity {
  id: string;
  job_name: string;
  hours: number;
  date: string;
}

export function TeamMemberDetails({ open, onOpenChange, member, onEdit }: TeamMemberDetailsProps) {
  const [stats, setStats] = useState<Stats>({
    hoursThisMonth: 0,
    jobsCompleted: 0,
    avgRating: 0,
    appointmentsToday: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member && open) {
      fetchMemberStats();
    }
  }, [member, open]);

  const fetchMemberStats = async () => {
    if (!member) return;
    setLoading(true);

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const today = now.toISOString().split("T")[0];

      // Get time entries for this month
      const { data: timeEntries } = await supabase
        .from("time_entries")
        .select("hours, job_id, created_at, jobs(name)")
        .eq("user_id", member.id)
        .gte("created_at", startOfMonth);

      // Get appointments for today
      const { data: appointments } = await supabase
        .from("appointments")
        .select("id")
        .eq("assigned_user_id", member.id)
        .gte("start_time", today)
        .lt("start_time", today + "T23:59:59");

      // Calculate stats
      const totalHours = timeEntries?.reduce((sum, entry) => sum + (entry.hours || 0), 0) || 0;
      const uniqueJobs = new Set(timeEntries?.map((e) => e.job_id)).size;

      setStats({
        hoursThisMonth: totalHours,
        jobsCompleted: uniqueJobs,
        avgRating: 4.8, // Placeholder - would come from reviews table
        appointmentsToday: appointments?.length || 0,
      });

      // Recent activity
      const recent = timeEntries?.slice(0, 5).map((entry: any) => ({
        id: entry.job_id,
        job_name: entry.jobs?.name || "Unknown Job",
        hours: entry.hours,
        date: entry.created_at,
      })) || [];

      setRecentActivity(recent);
    } catch (error) {
      console.error("Error fetching member stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
      case "manager":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (!member) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">{member.name}</SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>
                <Badge variant={member.status === "active" ? "default" : "secondary"}>
                  {member.status}
                </Badge>
              </div>
              {member.job_title && (
                <p className="text-sm text-muted-foreground mt-1">{member.job_title}</p>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${member.email}`} className="text-primary hover:underline">
                  {member.email}
                </a>
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${member.phone}`} className="text-primary hover:underline">
                    {member.phone}
                  </a>
                </div>
              )}
              {member.hourly_rate && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${member.hourly_rate.toFixed(2)}/hr</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {format(new Date(member.created_at), "MMM d, yyyy")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stats.hoursThisMonth.toFixed(1)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Hours This Month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stats.jobsCompleted}</span>
                </div>
                <p className="text-xs text-muted-foreground">Jobs Worked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stats.appointmentsToday}</span>
                </div>
                <p className="text-xs text-muted-foreground">Appointments Today</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{activity.job_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge variant="outline">{activity.hours}h</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button onClick={onEdit} className="flex-1">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
