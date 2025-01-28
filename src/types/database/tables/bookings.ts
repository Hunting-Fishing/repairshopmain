import { BookingStatus } from "./auth"

export interface BookingRow {
  id: string
  organization_id: string
  customer_name: string
  vehicle_info: string
  job_description: string
  assigned_technician_id: string | null
  start_time: string
  end_time: string
  status: BookingStatus | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

export interface BookingInsert extends Partial<Omit<BookingRow, 'id' | 'created_at' | 'updated_at'>> {
  customer_name: string
  vehicle_info: string
  job_description: string
  organization_id: string
  start_time: string
  end_time: string
  created_by: string
  updated_by: string
}

export interface BookingUpdate extends Partial<BookingRow> {}