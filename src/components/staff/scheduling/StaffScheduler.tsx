
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { SchedulingProps, Shift } from "@/types/scheduling";
import { toast } from "sonner";
import { ShiftCard } from "./components/ShiftCard";
import { ShiftSelector } from "./components/ShiftSelector";
import { parseTime, isSameDay, addMinutes } from "./utils/timeUtils";

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

          <ShiftSelector
            staff={staff}
            shiftTypes={shiftTypes}
            onStaffSelect={(value) => setSelectedStaff(Number(value))}
            onShiftTypeSelect={setSelectedShiftType}
          />
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
                  <ShiftCard
                    key={shift.id}
                    staffMember={staffMember}
                    shiftType={shiftType}
                    startTime={shift.startTime}
                    endTime={shift.endTime}
                    onDelete={() => setShifts(shifts.filter((s) => s.id !== shift.id))}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
