import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Play } from "lucide-react";

interface TimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: string;
  onTimeStarted: (entry: any) => void;
}

interface CostCode {
  id: string;
  code: string;
  name: string;
  type: string;
}

export const TimeEntryDialog = ({ 
  open, 
  onOpenChange, 
  jobId, 
  onTimeStarted 
}: TimeEntryDialogProps) => {
  const [costCodes, setCostCodes] = useState<CostCode[]>([]);
  const [selectedCostCode, setSelectedCostCode] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCostCodes();
    }
  }, [open]);

  const fetchCostCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('cost_codes')
        .select('*')
        .eq('type', 'labor')
        .eq('active', true)
        .order('code');

      if (error) throw error;
      setCostCodes(data || []);
    } catch (error) {
      console.error('Error fetching cost codes:', error);
      toast.error('Failed to load cost codes');
    }
  };

  const startTimer = async () => {
    if (!selectedCostCode || !jobId) {
      toast.error('Please select a cost code');
      return;
    }

    try {
      setLoading(true);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          job_id: jobId,
          user_id: user.user.id,
          cost_code_id: selectedCostCode,
          start_time: new Date().toISOString(),
          notes,
          source: 'mobile'
        })
        .select(`
          *,
          cost_code:cost_codes(code, name)
        `)
        .single();

      if (error) throw error;

      toast.success('Timer started');
      onTimeStarted(data);
      
      // Reset form
      setSelectedCostCode('');
      setNotes('');
    } catch (error) {
      console.error('Error starting timer:', error);
      toast.error('Failed to start timer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Start Time Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="costCode">Cost Code *</Label>
            <Select value={selectedCostCode} onValueChange={setSelectedCostCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select cost code" />
              </SelectTrigger>
              <SelectContent>
                {costCodes.map((code) => (
                  <SelectItem key={code.id} value={code.id}>
                    {code.code} - {code.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this work..."
              rows={3}
            />
          </div>

          <Button 
            onClick={startTimer} 
            disabled={loading || !selectedCostCode}
            size="lg"
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {loading ? 'Starting Timer...' : 'Start Timer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};