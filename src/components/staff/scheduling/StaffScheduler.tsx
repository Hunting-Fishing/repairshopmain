
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { SchedulingProps, Shift } from "@/types/scheduling";
import { toast } from "sonner";

export function StaffScheduler({ staff, shiftTypes }: SchedulingProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [selectedShiftType, setSelectedShiftType] = useState<string | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const validateShift = (
    staffId: number,
    date: Date,
    startTime: string,
    endTime: string
  ): boolean => {
    // Check for overlapping shifts
    const hasOverlap = shifts.some((shift) => {
      if (shift.staffId !== staffId) return false;
      if (!isSameDay(new Date(shift.date), date)) return false;

      const newStart = parseTime(startTime);
      const newEnd = parseTime(endTime);
      const existingStart = parseTime(shift.startTime);
      const existingEnd = parseTime(shift.endTime);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd)
      );
    });

    if (hasOverlap) {
      toast.error("This shift overlaps with an existing shift");
      return false;
    }

    // Ensure minimum break between shifts (30 minutes)
    const minBreak = 30;
    const hasEnoughBreak = shifts.every((shift) => {
      if (shift.staffId !== staffId) return true;
      if (!isSameDay(new Date(shift.date), date)) return true;

      const newStart = parseTime(startTime);
      const newEnd = parseTime(endTime);
      const existingStart = parseTime(shift.startTime);
      const existingEnd = parseTime(shift.endTime);

      const breakAfter = (newStart - existingEnd) / 60000;
      const breakBefore = (existingStart - newEnd) / 60000;

      return breakAfter >= minBreak || breakBefore >= minBreak;
    });

    if (!hasEnoughBreak) {
      toast.error("Staff must have at least 30 minutes break between shifts");
      return false;
    }

    return true;
  };

  const handleAddShift = () => {
    if (!selectedStaff || !selectedShiftType || !selectedDate) {
      toast.error("Please select staff member, shift type, and date");
      return;
    }

    const shiftType = shiftTypes.find((st) => st.name === selectedShiftType);
    if (!shiftType) return;

    const startTime = "09:00";
    const endTime = format(
      addMinutes(parseTime(startTime), shiftType.duration),
      "HH:mm"
    );

    if (!validateShift(selectedStaff, selectedDate, startTime, endTime)) {
      return;
    }

    const newShift: Shift = {
      id: crypto.randomUUID(),
      staffId: selectedStaff,
      date: selectedDate,
      startTime,
      endTime,
      shiftTypeId: selectedShiftType,
      status: "scheduled",
    };

    setShifts([...shifts, newShift]);
    toast.success("Shift added successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Staff Scheduler</h2>
        <Button onClick={handleAddShift} className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Add Shift
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />

          <div className="space-y-2">
            <Select onValueChange={(value) => setSelectedStaff(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedShiftType}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift type" />
              </SelectTrigger>
              <SelectContent>
                {shiftTypes.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
                    {type.name} ({type.duration} minutes)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="min-h-[500px] rounded-lg border p-4">
          <div className="space-y-4">
            {shifts
              .filter((shift) => isSameDay(new Date(shift.date), selectedDate))
              .map((shift) => {
                const staffMember = staff.find((s) => s.id === shift.staffId);
                const shiftType = shiftTypes.find(
                  (st) => st.name === shift.shiftTypeId
                );

                return (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <h3 className="font-medium">{staffMember?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {shiftType?.name} - {shift.startTime} to {shift.endTime}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setShifts(shifts.filter((s) => s.id !== shift.id))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function addMinutes(timestamp: number, minutes: number): Date {
  return new Date(timestamp + minutes * 60000);
}
