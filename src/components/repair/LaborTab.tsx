
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Labor {
  id: string;
  technician_id: string;
  start_time: string;
  end_time: string | null;
  rate_per_hour: number;
  notes: string;
  technician: {
    first_name: string;
    last_name: string;
  };
}

interface LaborTabProps {
  repairJobId: string;
}

export function LaborTab({ repairJobId }: LaborTabProps) {
  const [isAddLaborOpen, setIsAddLaborOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rate, setRate] = useState("");
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: labor, isLoading } = useQuery({
    queryKey: ['repair-labor', repairJobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_job_labor')
        .select(`
          *,
          technician:technician_id (first_name, last_name)
        `)
        .eq('repair_job_id', repairJobId);

      if (error) throw error;
      return data as Labor[];
    }
  });

  const { data: technicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'technician');

      if (error) throw error;
      return data;
    }
  });

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
      setIsAddLaborOpen(false);
      resetForm();
      toast.success("Labor entry added successfully");
    },
    onError: () => {
      toast.error("Failed to add labor entry");
    }
  });

  const resetForm = () => {
    setSelectedTechnician("");
    setStartTime("");
    setEndTime("");
    setRate("");
    setNotes("");
  };

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

  if (isLoading) {
    return <div>Loading labor entries...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Labor Records</h3>
          <Dialog open={isAddLaborOpen} onOpenChange={setIsAddLaborOpen}>
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
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Rate/Hour</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labor?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No labor entries yet</TableCell>
              </TableRow>
            ) : (
              labor?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {entry.technician.first_name} {entry.technician.last_name}
                  </TableCell>
                  <TableCell>{format(new Date(entry.start_time), 'PPp')}</TableCell>
                  <TableCell>
                    {entry.end_time ? format(new Date(entry.end_time), 'PPp') : 'In Progress'}
                  </TableCell>
                  <TableCell>${entry.rate_per_hour}/hr</TableCell>
                  <TableCell>{entry.notes}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
