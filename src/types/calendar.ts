
export interface ColorPreferences {
  primary_color: string;
  secondary_color: string;
  border_color?: string;
  background_color?: string;
}

export interface CalendarSettings {
  defaultView: 'day' | 'week' | 'month';
  use24HourTime: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  timeIncrement: '15' | '30' | '60';
  theme: 'light' | 'dark' | 'neutral' | 'warm' | 'cool';
  allowOverlappingBookings: boolean;
  bufferBefore: '0' | '15' | '30';
  bufferAfter: '0' | '15' | '30';
  primaryColor: string;
  secondaryColor: string;
  showTechnicianWorkload?: boolean;
  enableTechnicianColors?: boolean;
  technicianViewMode?: 'individual' | 'combined' | 'filtered';
  showTechnicianAvailability?: boolean;
  enableTechnicianSpecialties?: boolean;
  technicianScheduleConflictHandling?: 'warn' | 'block' | 'allow';
  showTechnicianStats?: boolean;
  enableAutoAssignment?: boolean;
}

export interface TechnicianViewSettings {
  showWorkload: boolean;
  showAvailability: boolean;
  enableColors: boolean;
  viewMode: 'individual' | 'combined' | 'filtered';
  maxDailyBookings: number;
  preferredWorkTypes: string[];
  scheduleConflictHandling: 'warn' | 'block' | 'allow';
  autoAssignmentPreferences: {
    considerWorkload: boolean;
    considerSpecialties: boolean;
    considerLocation: boolean;
  };
}

export interface Booking {
  id: string;
  customer_name: string;
  vehicle_info: string;
  job_description: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  last_updated_by?: string;
  last_status_change?: string;
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface TimeSlot {
  start: Date;
  end: Date;
  bookings: Booking[];
}

export interface CalendarViewProps {
  date: Date;
  bookings: Booking[];
  isLoading: boolean;
  onTimeSlotClick: (start: Date, end: Date) => void;
  workingHours?: {
    start: number;
    end: number;
  };
  use24HourTime?: boolean;
  colorPreferences?: ColorPreferences;
  showTechnicianWorkload?: boolean;
}
