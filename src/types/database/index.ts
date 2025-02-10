
import { BookingRow, BookingInsert, BookingUpdate } from './tables/bookings'
import { OrganizationRow, OrganizationInsert, OrganizationUpdate } from './tables/organizations'
import { ProfileRow, ProfileInsert, ProfileUpdate } from './tables/profiles'
import { UserRole, BookingStatus } from './enums'
import type { Json } from './shared/json'
import type { DatabaseFunctions } from './functions'

export interface Database {
  public: {
    Tables: {
      error_logs: {
        Row: {
          id: string
          error_message: string | null
          error_stack: string | null
          component_name: string | null
          route: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          error_message?: string | null
          error_stack?: string | null
          component_name?: string | null
          route?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          error_message?: string | null
          error_stack?: string | null
          component_name?: string | null
          route?: string | null
          created_at?: string | null
        }
      }
      bookings: {
        Row: BookingRow
        Insert: BookingInsert
        Update: BookingUpdate
        Relationships: [
          {
            foreignKeyName: "bookings_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: OrganizationRow
        Insert: OrganizationInsert
        Update: OrganizationUpdate
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
        Relationships: [
          {
            foreignKeyName: "profiles_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: DatabaseFunctions
    Enums: {
      booking_status: BookingStatus
      user_role: UserRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Re-export common types
export type { ProfileRow, ProfileInsert, ProfileUpdate } from './tables/profiles'
export type { BookingRow, BookingInsert, BookingUpdate } from './tables/bookings'
export type { OrganizationRow, OrganizationInsert, OrganizationUpdate } from './tables/organizations'
export type { UserRole, BookingStatus } from './enums'
export type { Json } from './shared/json'
export type { DatabaseFunctions } from './functions'
