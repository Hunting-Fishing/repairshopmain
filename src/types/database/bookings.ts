
import { Json } from "./shared/json";

export interface BookingRow {
  id: string
  organization_id: string
  customer_name: string
  vehicle_info: string
  job_description: string
  assigned_technician_id: string | null
  start_time: string
  end_time: string
  status: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  phone_number: string | null
  email: string | null
  notes: string | null
  duration_minutes: number
  color: string | null
  estimated_cost: number | null
  priority: string
  source: string
  notification_preferences: Json
}

export interface BookingInsert extends Partial<Omit<BookingRow, 'id' | 'created_at' | 'updated_at'>> {
  customer_name: string
  vehicle_info: string
  job_description: string
  start_time: string
  end_time: string
  organization_id: string
  created_by: string
  updated_by: string
  duration_minutes: number
}

export interface BookingUpdate extends Partial<BookingRow> {}

export interface BookingNotification {
  id: string
  booking_id: string
  type: string
  status: string
  sent_at: string | null
  error: string | null
  created_at: string
  organization_id: string
}

export interface BookingHistory {
  id: string
  booking_id: string
  changed_by: string
  change_type: string
  previous_data: Json
  new_data: Json
  created_at: string
  organization_id: string
}
