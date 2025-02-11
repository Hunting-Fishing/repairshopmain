
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Technician } from "@/types/labor";
import { AlertCircle, PlayCircle, StopCircle, Timer } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LaborFormProps {
  repairJobId: string;
  technicians: Technician[] | undefined;
  onSuccess?: () => void;
}

export function LaborForm({ repairJobId, technicians, onSuccess }: LaborFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rate, setRate] = useState("");
  const [notes, setNotes] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [laborRateType, setLaborRateType] = useState<string>("default");
  const queryClient = useQueryClient();

  // Get organization's default labor rate
  const { data: orgSettings } = useQuery({
    queryKey: ['organization-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('default_labor_rate')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const resetForm = () => {
    setSelectedTechnician("");
    setStartTime("");
    setEndTime("");
    setRate("");
    setNotes("");
    setIsTimerRunning(false);
    setTimerStartTime(null);
    setLaborRateType("default");
  };

  // Function to check for time conflicts
  const checkTimeConflicts = async (techId: string, start: string, end?: string) => {
    const { data, error } = await supabase.rpc('check_labor_time_conflicts', {
      p_technician_id: techId,
      p_start_time: start,
      p_end_time: end || null
    });

    if (error) {
      console.error('Error checking time conflicts:', error);
      return false;
    }

    return data;
  };

  const addLaborMutation = useMutation({
    mutationFn: async (newLabor: {
      repair_job_id: string;
      technician_id: string;
      start_time: string;
      end_time?: string;
      rate_per_hour: number;
      notes: string;
      status: 'pending' | 'in_progress' | 'completed';
      is_timer_running: boolean;
      timer_started_at?: string;
      labor_rate_type: string;
      labor_rate_source: string;
    }) => {
      // First check for time conflicts
      const isAvailable = await checkTimeConflicts(
        newLabor.technician_id, 
        newLabor.start_time,
        newLabor.end_time
      );

      if (!isAvailable) {
        throw new Error("Time slot conflicts with existing labor entry");
      }

      const { error } = await supabase
        .from('repair_job_labor')
        .insert(newLabor);

      if (error) {
        await supabase.from('error_logs').insert({
          error_message: error.message,
          error_stack: error.details,
          component_name: 'LaborForm',
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-labor'] });
      setIsOpen(false);
      resetForm();
      toast.success("Labor entry added successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to add labor entry: ${error.message}`);
    }
  });

  const handleTimerToggle = () => {
    if (!selectedTechnician) {
      toast.error("Please select a technician first");
      return;
    }

    if (!isTimerRunning) {
      setTimerStartTime(new Date());
      setStartTime(new Date().toISOString());
      setIsTimerRunning(true);
    } else {
      setEndTime(new Date().toISOString());
      setIsTimerRunning(false);
    }
  };

  const handleAddLabor = () => {
    if (!selectedTechnician || !startTime || !rate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const status = endTime ? 'completed' : 'in_progress';
    const rateSource = rate === orgSettings?.default_labor_rate ? 'default' : 'manual';

    addLaborMutation.mutate({
      repair_job_id: repairJobId,
      technician_id: selectedTechnician,
      start_time: startTime,
      end_time: endTime || undefined,
      rate_per_hour: parseFloat(rate),
      notes,
      status,
      is_timer_running: isTimerRunning,
      timer_started_at: timerStartTime?.toISOString(),
      labor_rate_type: laborRateType,
      labor_rate_source: rateSource,
    });
  };

  // Set default rate when technician is selected
  useEffect(() => {
    if (orgSettings?.default_labor_rate && !rate) {
      setRate(orgSettings.default_labor_rate.toString());
    }
  }, [orgSettings, rate]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Labor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Labor Entry</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          handleAddLabor();
        }}>
          <div>
            <Label htmlFor="technician">Technician</Label>
            <select
              id="technician"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              aria-required="true"
            >
              <option value="">Select a technician...</option>
              {technicians?.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.first_name} {tech.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              type="button" 
              variant={isTimerRunning ? "destructive" : "default"}
              onClick={handleTimerToggle}
              className="flex items-center gap-2"
            >
              {isTimerRunning ? (
                <>
                  <StopCircle className="h-4 w-4" />
                  Stop Timer
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  Start Timer
                </>
              )}
            </Button>
            {isTimerRunning && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                Running...
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime ? new Date(startTime).toISOString().slice(0, 16) : ""}
              onChange={(e) => setStartTime(new Date(e.target.value).toISOString())}
              required
              disabled={isTimerRunning}
              aria-required="true"
            />
          </div>

          {!isTimerRunning && (
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime ? new Date(endTime).toISOString().slice(0, 16) : ""}
                onChange={(e) => setEndTime(new Date(e.target.value).toISOString())}
                min={startTime ? new Date(startTime).toISOString().slice(0, 16) : undefined}
              />
            </div>
          )}

          <div>
            <Label htmlFor="rateType">Rate Type</Label>
            <Select value={laborRateType} onValueChange={setLaborRateType}>
              <SelectTrigger>
                <SelectValue placeholder="Select rate type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Rate</SelectItem>
                <SelectItem value="overtime">Overtime Rate</SelectItem>
                <SelectItem value="holiday">Holiday Rate</SelectItem>
                <SelectItem value="custom">Custom Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="rate">Rate per Hour ($)</Label>
            <Input
              id="rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
              aria-required="true"
            />
            {orgSettings?.default_labor_rate && (
              <p className="text-sm text-muted-foreground mt-1">
                Organization default rate: ${orgSettings.default_labor_rate}/hr
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {addLaborMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {addLaborMutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit"
            disabled={addLaborMutation.isPending}
          >
            {addLaborMutation.isPending ? "Adding..." : "Add Labor Entry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
