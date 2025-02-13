
import { Json } from "../shared/json"

export interface SchedulingViolationRow {
  id: string
  organization_id: string
  booking_id: string
  technician_id: string | null
  violation_type: string
  violation_details: Json | null
  created_at: string
  resolved_at: string | null
  resolution_notes: string | null
  status: 'pending' | 'resolved' | 'ignored'
}

export interface SchedulingViolationInsert extends Partial<Omit<SchedulingViolationRow, 'id' | 'created_at'>> {
  organization_id: string
  booking_id: string
  violation_type: string
}

export interface SchedulingViolationUpdate extends Partial<SchedulingViolationRow> {}
