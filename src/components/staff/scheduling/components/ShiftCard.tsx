
import { Button } from "@/components/ui/button";
import { ShiftType, StaffMemberSchedule } from "@/types/scheduling";

interface ShiftCardProps {
  staffMember: StaffMemberSchedule | undefined;
  shiftType: ShiftType | undefined;
  startTime: string;
  endTime: string;
  onDelete: () => void;
}

export function ShiftCard({ staffMember, shiftType, startTime, endTime, onDelete }: ShiftCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div>
        <h3 className="font-medium">{staffMember?.name}</h3>
        <p className="text-sm text-muted-foreground">
          {shiftType?.name} - {startTime} to {endTime}
        </p>
      </div>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        Remove
      </Button>
    </div>
  );
}
