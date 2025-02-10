
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LaborFormProps {
  repairJobId: string;
  technicians: Array<{
    id: string;
    first_name: string;
    last_name: string;
  }> | undefined;
  onSuccess?: () => void;
}

export function LaborForm({ repairJobId, technicians, onSuccess }: LaborFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rate, setRate] = useState("");
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const resetForm = () => {
    setSelectedTechnician("");
    setStartTime("");
    setEndTime("");
    setRate("");
    setNotes("");
  };

  const addLaborMutation = useMutation({
    mutationFn: async (newLabor: {
      repair_job_id: string;
      technician_id: string;
      start_time: string;
      end_time?: string;
      rate_per_hour: number;
      notes: string;
    }) => {
      const { error } = await supabase
        .from('repair_job_labor')
        .insert(newLabor);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-labor'] });
      setIsOpen(false);
      resetForm();
      toast.success("Labor entry added successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to add labor entry");
    }
  });

  const handleAddLabor = () => {
    if (!selectedTechnician || !startTime || !rate) {
      toast.error("Please fill in all required fields");
      return;
    }

    addLaborMutation.mutate({
      repair_job_id: repairJobId,
      technician_id: selectedTechnician,
      start_time: startTime,
      end_time: endTime || undefined,
      rate_per_hour: parseFloat(rate),
      notes,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Labor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Labor Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="technician">Technician</Label>
            <select
              id="technician"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">Select a technician...</option>
              {technicians?.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.first_name} {tech.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
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
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={handleAddLabor}>Add Labor Entry</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
