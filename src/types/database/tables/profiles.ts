import { Json, UserRole } from "./auth"

export interface ProfileRow {
  id: string
  organization_id: string | null
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
  street_address: string | null
  city: string | null
  state_province: string | null
  postal_code: string | null
  country: string | null
  phone_number: string | null
  calendar_settings: Json | null
  technician_settings: Json | null
  role: UserRole
  custom_role_id: string | null
  hire_date: string | null
  schedule: Json | null
  notes: string | null
  status: string | null
  invitation_token: string | null
  invitation_sent_at: string | null
}

export interface ProfileInsert extends Partial<Omit<ProfileRow, 'created_at' | 'updated_at'>> {
  id: string
  role: UserRole
}

export interface ProfileUpdate extends Partial<ProfileRow> {}