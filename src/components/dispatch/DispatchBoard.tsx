import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  User,
  Phone,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

type DispatchStatus = "unassigned" | "scheduled" | "in_progress" | "completed";

interface DispatchAppointment {
  id: string;
  title: string;
  description: string | null;
  service_type: string | null;
  address: string | null;
  start_time: string;
  end_time: string;
  status: string | null;
  notes: string | null;
  assigned_user_id?: string | null;
  customer_id?: string | null;
  customer: {
    id: string;
    name: string;
    phone?: string | null;
  } | null;
  assigned_user: {
    id: string;
    name: string;
  } | null;
}

interface Technician {
  id: string;
  name: string;
  role: string;
}

const statusOrder: DispatchStatus[] = [
  "unassigned",
  "scheduled",
  "in_progress",
  "completed",
];

const statusLabels: Record<DispatchStatus, string> = {
  unassigned: "Unassigned",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
};

function mapAppointmentToDispatchStatus(
  appointment: DispatchAppointment
): DispatchStatus {
  if (!appointment.assigned_user && appointment.status !== "completed") {
    return "unassigned";
  }
  const raw = (appointment.status || "").toLowerCase();
  if (["completed", "showed"].includes(raw)) return "completed";
  if (["in_progress", "in-progress", "on-job", "working"].includes(raw))
    return "in_progress";
  return "scheduled";
}

function getStatusBadgeClass(status: DispatchStatus) {
  switch (status) {
    case "unassigned":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200";
    case "scheduled":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200";
  }
}

export function DispatchBoard() {
  const { userData } = useOrganization();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<DispatchAppointment[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.organization_id) {
      void loadBoard();
    }
  }, [userData?.organization_id, selectedDate]);

  const loadBoard = async () => {
    if (!userData?.organization_id) return;
    try {
      setLoading(true);
      const dayStart = startOfDay(selectedDate).toISOString();
      const dayEnd = endOfDay(selectedDate).toISOString();

      const [apptRes, techRes] = await Promise.all([
        supabase
          .from("appointments")
          .select(
            `id, title, description, service_type, address, start_time, end_time, status, notes, assigned_user_id, customer_id, customer:customers(id, name, phone), assigned_user:users!appointments_assigned_user_id_fkey(id, name)`
          )
          .eq("organization_id", userData.organization_id)
          .gte("start_time", dayStart)
          .lte("start_time", dayEnd)
          .order("start_time", { ascending: true }),
        supabase
          .from("users")
          .select("id, name, role")
          .eq("organization_id", userData.organization_id)
          .in("role", ["technician", "admin", "owner", "manager"])
          .order("name", { ascending: true }),
      ]);

      if (apptRes.error) throw apptRes.error;
      if (techRes.error) throw techRes.error;

      setAppointments((apptRes.data as unknown as DispatchAppointment[]) || []);
      setTechnicians((techRes.data as Technician[]) || []);
    } catch (error) {
      console.error("Error loading dispatch board:", error);
      toast.error("Failed to load dispatch board");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter(
      (appt) =>
        appt.title?.toLowerCase().includes(term) ||
        appt.service_type?.toLowerCase().includes(term) ||
        appt.address?.toLowerCase().includes(term) ||
        appt.customer?.name?.toLowerCase().includes(term) ||
        appt.assigned_user?.name?.toLowerCase().includes(term)
    );
  }, [appointments, search]);

  const grouped = useMemo(() => {
    const buckets: Record<DispatchStatus, DispatchAppointment[]> = {
      unassigned: [],
      scheduled: [],
      in_progress: [],
      completed: [],
    };
    for (const appt of filteredAppointments) {
      buckets[mapAppointmentToDispatchStatus(appt)].push(appt);
    }
    return buckets;
  }, [filteredAppointments]);

  const technicianCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const appt of appointments) {
      if (appt.assigned_user?.id) {
        counts[appt.assigned_user.id] =
          (counts[appt.assigned_user.id] || 0) + 1;
      }
    }
    return counts;
  }, [appointments]);

  const updateAppointment = async (
    appointmentId: string,
    updates: { assigned_user_id?: string | null; status?: string }
  ) => {
    try {
      setSaving(appointmentId);
      const { error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", appointmentId);
      if (error) throw error;

      setAppointments((prev) =>
        prev.map((item) => {
          if (item.id !== appointmentId) return item;
          const nextAssignedUser =
            updates.assigned_user_id === undefined
              ? item.assigned_user
              : updates.assigned_user_id === null
              ? null
              : technicians.find((t) => t.id === updates.assigned_user_id)
              ? {
                  id: updates.assigned_user_id,
                  name:
                    technicians.find((t) => t.id === updates.assigned_user_id)
                      ?.name || "Assigned",
                }
              : item.assigned_user;
          return {
            ...item,
            assigned_user_id:
              updates.assigned_user_id === undefined
                ? item.assigned_user_id
                : updates.assigned_user_id,
            assigned_user: nextAssignedUser,
            status: updates.status ?? item.status,
          };
        })
      );
      toast.success("Dispatch updated");
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update dispatch");
    } finally {
      setSaving(null);
      setDraggingId(null);
    }
  };

  const assignTechnician = async (
    appointmentId: string,
    technicianId: string
  ) => {
    await updateAppointment(appointmentId, {
      assigned_user_id: technicianId,
      status: "confirmed",
    });
  };

  const moveToStatus = async (
    appointmentId: string,
    status: DispatchStatus
  ) => {
    if (status === "unassigned") {
      await updateAppointment(appointmentId, {
        assigned_user_id: null,
        status: "pending",
      });
      return;
    }
    const nextStatus =
      status === "scheduled"
        ? "confirmed"
        : status === "in_progress"
        ? "in_progress"
        : "completed";
    await updateAppointment(appointmentId, { status: nextStatus });
  };

  const handleCall = (phone?: string | null) => {
    if (!phone) {
      toast.error("No phone number found for this customer");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dispatch Board</h1>
          <p className="text-sm text-muted-foreground">
            Run the day from one screen: assign techs, move jobs, and track
            completion
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="w-40"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => {
                const next = new Date(`${e.target.value}T12:00:00`);
                if (!Number.isNaN(next.getTime())) setSelectedDate(next);
              }}
            />
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, tech, address..."
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => void loadBoard()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statusOrder.map((status) => (
          <div
            key={status}
            className={cn(
              "rounded-lg border px-4 py-3 text-center",
              getStatusBadgeClass(status)
            )}
          >
            <p className="text-sm font-semibold">{statusLabels[status]}</p>
            <p className="text-2xl font-bold">{grouped[status].length}</p>
          </div>
        ))}
      </div>

      {/* Main board */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Technician sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Technician Load</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : technicians.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No technicians found.
              </p>
            ) : (
              technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const appointmentId = e.dataTransfer.getData("text/plain");
                    if (appointmentId) {
                      await assignTechnician(appointmentId, tech.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{tech.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {tech.role}
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {technicianCounts[tech.id] || 0} jobs
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag a job card here to assign
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Kanban columns */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statusOrder.map((columnStatus) => (
            <div
              key={columnStatus}
              className="rounded-lg border bg-muted/30 p-3 min-h-[300px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const appointmentId = e.dataTransfer.getData("text/plain");
                if (appointmentId) {
                  await moveToStatus(appointmentId, columnStatus);
                }
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">
                  {statusLabels[columnStatus]}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {grouped[columnStatus].length}
                </Badge>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <>
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </>
                ) : grouped[columnStatus].length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No jobs here
                  </p>
                ) : (
                  grouped[columnStatus].map((appt) => {
                    const displayStatus =
                      mapAppointmentToDispatchStatus(appt);
                    const isSaving = saving === appt.id;

                    return (
                      <Card
                        key={appt.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggingId(appt.id);
                          e.dataTransfer.setData("text/plain", appt.id);
                        }}
                        onDragEnd={() => setDraggingId(null)}
                        className={cn(
                          "cursor-grab active:cursor-grabbing transition-all",
                          draggingId === appt.id && "opacity-60",
                          isSaving && "opacity-50 pointer-events-none"
                        )}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {appt.customer?.name || "Unknown Customer"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {appt.title}
                              </p>
                            </div>
                            <Badge
                              className={cn(
                                "shrink-0 text-xs",
                                getStatusBadgeClass(displayStatus)
                              )}
                            >
                              {statusLabels[displayStatus]}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span>
                                {format(new Date(appt.start_time), "h:mm a")} –{" "}
                                {format(new Date(appt.end_time), "h:mm a")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Wrench className="h-3 w-3 shrink-0" />
                              {appt.service_type || "Service call"}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {appt.address || "No address entered"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User className="h-3 w-3 shrink-0" />
                              {appt.assigned_user?.name || "Unassigned"}
                            </div>
                          </div>

                          {displayStatus === "unassigned" && (
                            <div className="flex items-center gap-1 text-xs text-amber-600">
                              <AlertTriangle className="h-3 w-3" />
                              Drag to a technician or column
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 pt-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => handleCall(appt.customer?.phone)}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                            {displayStatus !== "in_progress" &&
                              displayStatus !== "completed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() =>
                                    void moveToStatus(appt.id, "in_progress")
                                  }
                                >
                                  Start
                                </Button>
                              )}
                            {displayStatus !== "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() =>
                                  void moveToStatus(appt.id, "completed")
                                }
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
