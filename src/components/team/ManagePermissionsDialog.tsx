import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface ManagePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: TeamMember[];
  onSuccess: () => void;
}

export function ManagePermissionsDialog({ 
  open, 
  onOpenChange, 
  members, 
  onSuccess 
}: ManagePermissionsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: currentUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_user_id", user.id)
          .single();
        setCurrentUserId(currentUser?.id || null);
      }
    };
    fetchCurrentUser();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    setPendingChanges((prev) => ({
      ...prev,
      [memberId]: newRole,
    }));
  };

  const saveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info("No changes to save");
      return;
    }

    setLoading(true);

    try {
      // Update each member's role
      for (const [memberId, newRole] of Object.entries(pendingChanges)) {
        const { error } = await supabase
          .from("users")
          .update({ role: newRole })
          .eq("id", memberId);

        if (error) throw error;
      }

      toast.success("Permissions updated!", {
        description: `Updated ${Object.keys(pendingChanges).length} team member(s)`,
      });

      setPendingChanges({});
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update permissions", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
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

  const activeMembers = members.filter((m) => m.status === "active");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Team Permissions
          </DialogTitle>
          <DialogDescription>
            Change roles and permissions for your team members. Changes are saved when you click Save.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Be careful when changing roles. Owners and Admins have full access to all data and settings.
          </AlertDescription>
        </Alert>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {activeMembers.map((member) => {
              const currentRole = pendingChanges[member.id] || member.role;
              const hasChanged = pendingChanges[member.id] !== undefined;
              const isCurrentUser = member.id === currentUserId;

              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    hasChanged ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.name}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasChanged && (
                      <Badge variant="secondary" className="text-xs">
                        Changed
                      </Badge>
                    )}
                    <Select
                      value={currentRole}
                      onValueChange={(value) => handleRoleChange(member.id, value)}
                      disabled={isCurrentUser || member.role === "owner"}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        {member.role === "owner" && (
                          <SelectItem value="owner">Owner</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {Object.keys(pendingChanges).length > 0
              ? `${Object.keys(pendingChanges).length} change(s) pending`
              : "No changes"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveChanges}
              disabled={loading || Object.keys(pendingChanges).length === 0}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
