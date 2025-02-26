
import { Json } from "../shared/json"
import { BookingStatus } from "../enums"

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
  buffer_before_minutes: number
  buffer_after_minutes: number
  has_conflicts: boolean
  conflict_details: Json
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
