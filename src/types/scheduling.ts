
export interface StaffMemberSchedule {
  name: string;
  id: number;
}

export interface ShiftType {
  name: string;
  duration: number; // in minutes
}

export interface Shift {
  id: string;
  staffId: number;
  date: Date;
  startTime: string;
  endTime: string;
  shiftTypeId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface SchedulingProps {
  staff: StaffMemberSchedule[];
  shiftTypes: ShiftType[];
}
