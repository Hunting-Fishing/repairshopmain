
import { Json } from "../shared/json"
import { UserRole } from "../enums"

export interface ProfileRow {
  id: string
  organization_id: string | null
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
  role: UserRole
  custom_role_id: string | null
  calendar_settings: Json | null
  technician_settings: Json | null
  schedule: Json | null
  status: string | null
  hire_date: string | null
  notes: string | null
  invitation_token: string | null
  invitation_sent_at: string | null
  street_address: string | null
  city: string | null
  state_province: string | null
  postal_code: string | null
  country: string | null
  phone_number: string | null
  emergency_contact: string | null
  preferred_working_hours: string | null
  certifications: Json | null
  color_preferences: Json | null
  skills: string[] | null
  theme_preference: string | null
}

export interface ProfileInsert extends Partial<Omit<ProfileRow, 'created_at' | 'updated_at'>> {
  id: string
}

export interface ProfileUpdate extends Partial<ProfileRow> {}
