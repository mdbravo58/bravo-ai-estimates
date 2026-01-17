import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, UserPlus, Mail } from "lucide-react";

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddTeamMemberDialog({ open, onOpenChange, onSuccess }: AddTeamMemberDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "technician",
    jobTitle: "",
    hourlyRate: "",
    sendInvite: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user's organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: currentUser } = await supabase
        .from("users")
        .select("organization_id, id")
        .eq("auth_user_id", user.id)
        .single();

      if (!currentUser) throw new Error("User not found");

      if (formData.sendInvite) {
        // Create invitation
        const { error: inviteError } = await supabase
          .from("team_invites")
          .insert({
            organization_id: currentUser.organization_id,
            email: formData.email,
            name: formData.name,
            role: formData.role,
            job_title: formData.jobTitle || null,
            hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
            invited_by: currentUser.id,
          });

        if (inviteError) throw inviteError;
        toast.success("Invitation sent!", {
          description: `An invite has been created for ${formData.email}`,
        });
      } else {
        // Create user directly (for demo/testing purposes)
        const { error: userError } = await supabase
          .from("users")
          .insert({
            organization_id: currentUser.organization_id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone || null,
            role: formData.role,
            job_title: formData.jobTitle || null,
            hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
            invited_by: currentUser.id,
            status: "active",
          });

        if (userError) throw userError;
        toast.success("Team member added!", {
          description: `${formData.name} has been added to your team`,
        });
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "technician",
        jobTitle: "",
        hourlyRate: "",
        sendInvite: true,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Team Member
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
                placeholder="John Smith"
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
                placeholder="john@company.com"
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
                placeholder="(555) 123-4567"
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
                placeholder="Senior Technician"
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
                placeholder="25.00"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sendInvite" className="font-medium">Send Email Invitation</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Send an invite link for the user to create their account
              </p>
            </div>
            <Switch
              id="sendInvite"
              checked={formData.sendInvite}
              onCheckedChange={(checked) => setFormData({ ...formData, sendInvite: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formData.sendInvite ? "Send Invitation" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
