
import { Json } from "../shared/json"

export interface SchedulingRuleRow {
  id: string
  organization_id: string
  created_at: string
  updated_at: string
  max_daily_bookings: number
  min_break_minutes: number
  buffer_before_minutes: number
  buffer_after_minutes: number
  allow_overlapping_bookings: boolean
  auto_assign_enabled: boolean
  conflict_handling: 'warn' | 'block' | 'allow'
  working_hours: Json
}

export interface SchedulingRuleInsert extends Partial<Omit<SchedulingRuleRow, 'id' | 'created_at' | 'updated_at'>> {
  organization_id: string
}

export interface SchedulingRuleUpdate extends Partial<SchedulingRuleRow> {}
