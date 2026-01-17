import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Pencil, UserX, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  job_title: string | null;
  hourly_rate: number | null;
  status: string;
}

interface EditTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onSuccess: () => void;
}

export function EditTeamMemberDialog({ open, onOpenChange, member, onSuccess }: EditTeamMemberDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "technician",
    jobTitle: "",
    hourlyRate: "",
    status: "active",
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        role: member.role || "technician",
        jobTitle: member.job_title || "",
        hourlyRate: member.hourly_rate?.toString() || "",
        status: member.status || "active",
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          role: formData.role,
          job_title: formData.jobTitle || null,
          hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
          status: formData.status,
        })
        .eq("id", member.id);

      if (error) throw error;

      toast.success("Team member updated!", {
        description: `${formData.name}'s profile has been updated`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!member) return;
    setLoading(true);

    const newStatus = formData.status === "active" ? "inactive" : "active";

    try {
      const { error } = await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", member.id);

      if (error) throw error;

      setFormData({ ...formData, status: newStatus });
      toast.success(newStatus === "active" ? "Member reactivated" : "Member deactivated");
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to update status", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Team Member
            <Badge variant={formData.status === "active" ? "default" : "secondary"}>
              {formData.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                min="0"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="font-medium">Account Status</Label>
              <p className="text-sm text-muted-foreground">
                {formData.status === "active" 
                  ? "This member can access the system" 
                  : "This member cannot access the system"}
              </p>
            </div>
            <Button
              type="button"
              variant={formData.status === "active" ? "destructive" : "default"}
              size="sm"
              onClick={toggleStatus}
              disabled={loading}
            >
              {formData.status === "active" ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Reactivate
                </>
              )}
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
