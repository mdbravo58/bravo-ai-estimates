import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Mail, Phone, MoreVertical, Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddTeamMemberDialog } from "@/components/team/AddTeamMemberDialog";
import { EditTeamMemberDialog } from "@/components/team/EditTeamMemberDialog";
import { TeamMemberDetails } from "@/components/team/TeamMemberDetails";
import { ManagePermissionsDialog } from "@/components/team/ManagePermissionsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface Stats {
  totalMembers: number;
  technicians: number;
  managers: number;
  activeToday: number;
}

interface Performance {
  name: string;
  hours: number;
}

const TeamPage = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    technicians: 0,
    managers: 0,
    activeToday: 0,
  });
  const [performance, setPerformance] = useState<Performance[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      // Get current user's organization
      const { data: currentUser } = await supabase
        .from("users")
        .select("organization_id")
        .eq("auth_user_id", user.id)
        .single();

      if (!currentUser) {
        toast.error("User not found");
        return;
      }

      // Fetch team members
      const { data: members, error } = await supabase
        .from("users")
        .select("*")
        .eq("organization_id", currentUser.organization_id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTeam(members || []);

      // Calculate stats
      const activeMembers = members?.filter((m) => m.status === "active") || [];
      const techCount = activeMembers.filter((m) => m.role === "technician").length;
      const managerCount = activeMembers.filter((m) =>
        ["manager", "admin", "owner"].includes(m.role)
      ).length;

      // Get today's appointments to count active members
      const today = new Date().toISOString().split("T")[0];
      const { data: todayAppointments } = await supabase
        .from("appointments")
        .select("assigned_user_id")
        .gte("start_time", today)
        .lt("start_time", today + "T23:59:59");

      const activeToday = new Set(todayAppointments?.map((a) => a.assigned_user_id)).size;

      setStats({
        totalMembers: activeMembers.length,
        technicians: techCount,
        managers: managerCount,
        activeToday,
      });

      // Fetch performance data (hours this month)
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const memberIds = members?.map((m) => m.id) || [];

      if (memberIds.length > 0) {
        const { data: timeEntries } = await supabase
          .from("time_entries")
          .select("user_id, hours")
          .in("user_id", memberIds)
          .gte("created_at", startOfMonth);

        // Aggregate hours by user
        const hoursMap: Record<string, number> = {};
        timeEntries?.forEach((entry) => {
          hoursMap[entry.user_id] = (hoursMap[entry.user_id] || 0) + (entry.hours || 0);
        });

        // Create performance array sorted by hours
        const perfData = members
          ?.map((m) => ({
            name: m.name,
            hours: hoursMap[m.id] || 0,
          }))
          .sort((a, b) => b.hours - a.hours)
          .slice(0, 5) || [];

        setPerformance(perfData);
      }
    } catch (error: any) {
      console.error("Error fetching team:", error);
      toast.error("Failed to load team", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDetailsSheet(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Team Management</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and permissions</p>
          </div>
          <Button variant="hero" size="lg" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Technicians</p>
                  <p className="text-3xl font-bold mt-1">{stats.technicians}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Managers</p>
                  <p className="text-3xl font-bold mt-1">{stats.managers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                  <p className="text-3xl font-bold mt-1">{stats.activeToday}</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            {team.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No team members yet</h3>
                <p className="text-muted-foreground mb-4">Add your first team member to get started</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-lg p-4 hover:shadow-card transition-shadow cursor-pointer"
                    onClick={() => handleMemberClick(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{member.name}</h3>
                            <Badge variant={getRoleBadgeVariant(member.role)}>
                              {member.role}
                            </Badge>
                            {member.status !== "active" && (
                              <Badge variant="secondary">{member.status}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </span>
                            {member.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {member.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {member.job_title && (
                          <div className="text-right">
                            <p className="text-sm font-medium">{member.job_title}</p>
                            {member.hourly_rate && (
                              <p className="text-sm text-muted-foreground">
                                ${member.hourly_rate.toFixed(2)}/hr
                              </p>
                            )}
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMemberClick(member);
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(member);
                              }}
                            >
                              Edit Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {performance.length > 0 ? (
                performance.map((perf, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm">{perf.name}</span>
                    <span className="font-semibold">{perf.hours.toFixed(1)} hrs</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No time entries this month
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowPermissionsDialog(true)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Manage Permissions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Team Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create Training
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddTeamMemberDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={fetchTeam}
      />

      <EditTeamMemberDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        member={selectedMember}
        onSuccess={fetchTeam}
      />

      <TeamMemberDetails
        open={showDetailsSheet}
        onOpenChange={setShowDetailsSheet}
        member={selectedMember}
        onEdit={() => {
          setShowDetailsSheet(false);
          setShowEditDialog(true);
        }}
      />

      <ManagePermissionsDialog
        open={showPermissionsDialog}
        onOpenChange={setShowPermissionsDialog}
        members={team}
        onSuccess={fetchTeam}
      />
    </Layout>
  );
};

export default TeamPage;
