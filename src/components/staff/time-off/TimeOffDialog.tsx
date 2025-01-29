import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTimeOff } from "@/hooks/staff/useTimeOff";

export function TimeOffDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>();
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [notes, setNotes] = useState("");
  const { createTimeOff } = useTimeOff();

  const handleSubmit = () => {
    if (!date.from || !date.to || !type) return;

    createTimeOff.mutate({
      start_date: date.from.toISOString(),
      end_date: date.to.toISOString(),
      type: type as 'vacation' | 'sick' | 'personal' | 'training',
      notes,
    });

    setOpen(false);
    setDate({ from: undefined, to: undefined });
    setType(undefined);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Request Time Off</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Time Off</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type of leave" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="personal">Personal Leave</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>

          <Calendar
            mode="range"
            selected={{
              from: date.from,
              to: date.to,
            }}
            onSelect={(value: any) => setDate(value)}
            numberOfMonths={2}
          />

          <Textarea
            placeholder="Add any notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button 
            onClick={handleSubmit}
            disabled={!date.from || !date.to || !type}
          >
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}