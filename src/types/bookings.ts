
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
}

export interface BookingFormValues {
  customerName: string;
  vehicleInfo: string;
  jobDescription: string;
  assignedTechnicianId: string;
  phoneNumber: string;
  email: string;
  notes: string;
  estimatedCost: number;
  priority: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
}

export interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTimeSlot: { start: Date; end: Date } | null;
  onBookingCreated: () => void;
}

export interface BookingQueryResult extends BookingBase {
  technician?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}
