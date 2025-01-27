export interface Booking {
  id: string;
  customer_name: string;
  vehicle_info: string;
  job_description: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
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
}