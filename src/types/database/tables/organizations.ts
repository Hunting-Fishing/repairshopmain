import { Json } from "./auth"

export interface OrganizationRow {
  id: string
  name: string
  created_at: string
  updated_at: string
  phone_number: string | null
  business_type: string | null
  logo_url: string | null
  operating_hours: Json | null
  default_labor_rate: number | null
  tax_rate: number | null
  parts_markup: number | null
}

export interface OrganizationInsert extends Partial<Omit<OrganizationRow, 'id' | 'created_at' | 'updated_at'>> {
  name: string
}

export interface OrganizationUpdate extends Partial<OrganizationRow> {}