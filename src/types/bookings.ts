import { Json } from "./database/shared/json";
import { BookingStatus } from "./database/enums";

export interface BookingBase {
  id: string;
  organization_id: string;
  customer_name: string;
  vehicle_info: string;
  job_description: string;
  assigned_technician_id: string | null;
  start_time: string;
  end_time: string;
  status: BookingStatus | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  phone_number: string | null;
  email: string | null;
  notes: string | null;
  duration_minutes: number;
  color: string | null;
  estimated_cost: number | null;
  priority: string;
  source: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
  };
  required_parts?: Json[];
  parts_status?: string;
}

export interface BookingFormValues {
  customerName: string;
  customer?: {
    email?: string;
    phone?: string;
    name?: string;
  };
  vehicle?: {
    make?: string;
    model?: string;
    info?: string;
  };
  duration?: number;
  vehicleInfo: string;
  jobDescription: string;
  assignedTechnicianId: string;
  phoneNumber: string;
  email: string;
  notes: string;
  estimatedCost: number;
  priority: string;
  duration_minutes: number;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
  required_parts?: Json[];
}

export interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTimeSlot: { start: Date; end: Date } | null;
  onBookingCreated: () => void;
  workOrderId?: string;
  technicianId?: string;
}

export interface BookingQueryResult extends BookingBase {
  technician?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface BusinessHours {
  [key: string]: {
    start: string;
    end: string;
  } | null;
}

export interface SchedulingNotification {
  id: string;
  organization_id: string;
  booking_id: string;
  repair_job_id: string;
  notification_type: string;
  recipient_type: string;
  recipient_id: string;
  status: string;
  sent_at: string | null;
  created_at: string;
  message: string;
  error: string | null;
}
