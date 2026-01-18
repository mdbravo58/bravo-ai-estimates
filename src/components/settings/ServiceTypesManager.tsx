import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Settings2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  base_price: number | null;
  is_active: boolean;
  sort_order: number;
}

const INDUSTRIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "hvac", label: "HVAC" },
  { value: "electrical", label: "Electrical" },
  { value: "roofing", label: "Roofing" },
  { value: "landscaping", label: "Landscaping" },
  { value: "painting", label: "Painting" },
  { value: "cleaning", label: "Cleaning" },
  { value: "pest_control", label: "Pest Control" },
  { value: "appliance_repair", label: "Appliance Repair" },
  { value: "general_contractor", label: "General Contractor" },
];

export function ServiceTypesManager() {
  const { organization, refetch: refetchOrg } = useOrganization();
  const { toast } = useToast();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showIndustryDialog, setShowIndustryDialog] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
  });

  useEffect(() => {
    if (organization?.id) {
      fetchServiceTypes();
    }
  }, [organization?.id]);

  const fetchServiceTypes = async () => {
    if (!organization?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organization_service_types")
        .select("*")
        .eq("organization_id", organization.id)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setServiceTypes(data || []);
    } catch (err: any) {
      console.error("Error fetching service types:", err);
      toast({
        title: "Error",
        description: "Failed to load service types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateDefaults = async () => {
    if (!organization?.id || !selectedIndustry) return;

    try {
      setSaving(true);
      const { error } = await supabase.rpc("populate_default_service_types", {
        p_organization_id: organization.id,
        p_industry: selectedIndustry,
      });

      if (error) throw error;

      // Update organization industry
      await supabase
        .from("organizations")
        .update({ industry: selectedIndustry })
        .eq("id", organization.id);

      await fetchServiceTypes();
      await refetchOrg();
      setShowIndustryDialog(false);

      toast({
        title: "Services Updated",
        description: `Loaded default services for ${INDUSTRIES.find(i => i.value === selectedIndustry)?.label}`,
      });
    } catch (err: any) {
      console.error("Error populating defaults:", err);
      toast({
        title: "Error",
        description: "Failed to populate default services",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = async () => {
    if (!organization?.id || !formData.name.trim()) return;

    try {
      setSaving(true);
      const maxOrder = serviceTypes.reduce((max, s) => Math.max(max, s.sort_order), 0);

      const { error } = await supabase.from("organization_service_types").insert({
        organization_id: organization.id,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        base_price: formData.base_price ? parseFloat(formData.base_price) : null,
        sort_order: maxOrder + 1,
      });

      if (error) throw error;

      await fetchServiceTypes();
      setShowAddDialog(false);
      resetForm();

      toast({
        title: "Service Added",
        description: `Added "${formData.name}" to your services`,
      });
    } catch (err: any) {
      console.error("Error adding service:", err);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService || !formData.name.trim()) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("organization_service_types")
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          base_price: formData.base_price ? parseFloat(formData.base_price) : null,
        })
        .eq("id", editingService.id);

      if (error) throw error;

      await fetchServiceTypes();
      setEditingService(null);
      resetForm();

      toast({
        title: "Service Updated",
        description: `Updated "${formData.name}"`,
      });
    } catch (err: any) {
      console.error("Error updating service:", err);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: ServiceType) => {
    try {
      const { error } = await supabase
        .from("organization_service_types")
        .update({ is_active: !service.is_active })
        .eq("id", service.id);

      if (error) throw error;

      setServiceTypes(prev =>
        prev.map(s => (s.id === service.id ? { ...s, is_active: !s.is_active } : s))
      );
    } catch (err: any) {
      console.error("Error toggling service:", err);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (service: ServiceType) => {
    if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("organization_service_types")
        .delete()
        .eq("id", service.id);

      if (error) throw error;

      setServiceTypes(prev => prev.filter(s => s.id !== service.id));

      toast({
        title: "Service Deleted",
        description: `Removed "${service.name}"`,
      });
    } catch (err: any) {
      console.error("Error deleting service:", err);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service: ServiceType) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      base_price: service.base_price?.toString() || "",
    });
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", base_price: "" });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Service Types
            </CardTitle>
            <CardDescription>
              Manage the services your business offers
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowIndustryDialog(true)}>
              <Sparkles className="h-4 w-4 mr-1" />
              Load Defaults
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {serviceTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Settings2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No services configured</p>
              <p className="text-sm">Add services manually or load industry defaults</p>
            </div>
          ) : (
            <div className="space-y-2">
              {serviceTypes.map(service => (
                <div
                  key={service.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    service.is_active ? "bg-background" : "bg-muted/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={service.is_active}
                      onCheckedChange={() => handleToggleActive(service)}
                    />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {service.base_price && (
                      <span className="text-sm text-muted-foreground">
                        ${service.base_price.toFixed(2)}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteService(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Water Heater Repair"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div>
              <Label htmlFor="base_price">Base Price ($)</Label>
              <Input
                id="base_price"
                type="number"
                value={formData.base_price}
                onChange={e => setFormData({ ...formData, base_price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService} disabled={saving || !formData.name.trim()}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Service Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-base_price">Base Price ($)</Label>
              <Input
                id="edit-base_price"
                type="number"
                value={formData.base_price}
                onChange={e => setFormData({ ...formData, base_price: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingService(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateService} disabled={saving || !formData.name.trim()}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Industry Selection Dialog */}
      <Dialog open={showIndustryDialog} onOpenChange={setShowIndustryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Industry Defaults</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select your industry to load pre-configured service types. This will replace your
              current services.
            </p>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(industry => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIndustryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePopulateDefaults} disabled={saving || !selectedIndustry}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Load Defaults
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
