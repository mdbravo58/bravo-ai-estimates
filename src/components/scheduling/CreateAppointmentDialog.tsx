import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  ghl_contact_id: string | null;
}

interface Technician {
  id: string;
  name: string;
}

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  selectedDate?: Date;
}

export function CreateAppointmentDialog({ 
  open, 
  onOpenChange, 
  onSuccess,
  selectedDate 
}: CreateAppointmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  
  const [customerId, setCustomerId] = useState("");
  const [title, setTitle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("60");
  const [address, setAddress] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      fetchCustomersAndTechnicians();
      if (selectedDate) {
        setDate(selectedDate);
      }
    }
  }, [open, selectedDate]);

  const fetchCustomersAndTechnicians = async () => {
    try {
      const [customersResult, techniciansResult] = await Promise.all([
        supabase.from('customers').select('id, name, email, phone, address, ghl_contact_id'),
        supabase.from('users').select('id, name').in('role', ['technician', 'admin', 'owner', 'manager'])
      ]);

      if (customersResult.data) {
        setCustomers(customersResult.data);
      }
      if (techniciansResult.data) {
        setTechnicians(techniciansResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId || !title || !date) {
      toast.error("Please fill in required fields");
      return;
    }

    const selectedCustomer = customers.find(c => c.id === customerId);
    if (!selectedCustomer?.ghl_contact_id) {
      toast.error("Selected customer is not synced with GHL. Please sync contacts first.");
      return;
    }

    setLoading(true);
    try {
      // Calculate start and end times
      const [hours, minutes] = time.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime.getTime() + parseInt(duration) * 60 * 1000);

      const { data, error } = await supabase.functions.invoke('ghl-create-appointment', {
        body: {
          customerId,
          title,
          serviceType,
          address: address || selectedCustomer.address,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          assignedUserId: assignedUserId || null,
          notes,
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success("Appointment created successfully!");
      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      console.error('Error creating appointment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerId("");
    setTitle("");
    setServiceType("");
    setDate(new Date());
    setTime("09:00");
    setDuration("60");
    setAddress("");
    setAssignedUserId("");
    setNotes("");
  };

  const serviceTypes = [
    "Plumbing",
    "HVAC",
    "Electrical",
    "General Maintenance",
    "Installation",
    "Repair",
    "Inspection",
    "Emergency Service",
    "Other"
  ];

  const durations = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
    { value: "180", label: "3 hours" },
    { value: "240", label: "4 hours" },
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer *</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem 
                    key={customer.id} 
                    value={customer.id}
                    disabled={!customer.ghl_contact_id}
                  >
                    {customer.name} {!customer.ghl_contact_id && "(Not synced)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Appointment title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technician">Assigned Technician</Label>
            <Select value={assignedUserId} onValueChange={setAssignedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select technician (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Service address (uses customer address if blank)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
