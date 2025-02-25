
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShiftType, StaffMemberSchedule } from "@/types/scheduling";

interface ShiftSelectorProps {
  staff: StaffMemberSchedule[];
  shiftTypes: ShiftType[];
  onStaffSelect: (value: string) => void;
  onShiftTypeSelect: (value: string) => void;
}

export function ShiftSelector({
  staff,
  shiftTypes,
  onStaffSelect,
  onShiftTypeSelect,
}: ShiftSelectorProps) {
  return (
    <div className="space-y-2">
      <Select onValueChange={onStaffSelect}>
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

      <Select onValueChange={onShiftTypeSelect}>
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
  );
}
