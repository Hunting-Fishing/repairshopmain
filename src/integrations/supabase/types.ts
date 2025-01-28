export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          assigned_technician_id: string | null
          created_at: string
          created_by: string
          customer_name: string
          end_time: string
          id: string
          job_description: string
          organization_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          updated_at: string
          updated_by: string
          vehicle_info: string
        }
        Insert: {
          assigned_technician_id?: string | null
          created_at?: string
          created_by: string
          customer_name: string
          end_time: string
          id?: string
          job_description: string
          organization_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string
          updated_by: string
          vehicle_info: string
        }
        Update: {
          assigned_technician_id?: string | null
          created_at?: string
          created_by?: string
          customer_name?: string
          end_time?: string
          id?: string
          job_description?: string
          organization_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string
          updated_by?: string
          vehicle_info?: string
        }
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
          },
        ]
      }
      business_types: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: string
          name: string
          phone_code: string | null
          postal_code_format: string | null
          postal_code_regex: string | null
        }
        Insert: {
          id: string
          name: string
          phone_code?: string | null
          postal_code_format?: string | null
          postal_code_regex?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone_code?: string | null
          postal_code_format?: string | null
          postal_code_regex?: string | null
        }
        Relationships: []
      }
      custom_roles: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          business_type: string | null
          created_at: string
          default_labor_rate: number | null
          id: string
          logo_url: string | null
          name: string
          operating_hours: Json | null
          parts_markup: number | null
          phone_number: string | null
          tax_rate: number | null
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          default_labor_rate?: number | null
          id?: string
          logo_url?: string | null
          name: string
          operating_hours?: Json | null
          parts_markup?: number | null
          phone_number?: string | null
          tax_rate?: number | null
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          default_labor_rate?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          operating_hours?: Json | null
          parts_markup?: number | null
          phone_number?: string | null
          tax_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          calendar_settings: Json | null
          city: string | null
          country: string | null
          created_at: string
          custom_role_id: string | null
          first_name: string | null
          hire_date: string | null
          id: string
          invitation_sent_at: string | null
          invitation_token: string | null
          last_name: string | null
          notes: string | null
          organization_id: string | null
          phone_number: string | null
          postal_code: string | null
          role: Database["public"]["Enums"]["user_role"]
          schedule: Json | null
          state_province: string | null
          status: string | null
          street_address: string | null
          technician_settings: Json | null
          updated_at: string
        }
        Insert: {
          calendar_settings?: Json | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_role_id?: string | null
          first_name?: string | null
          hire_date?: string | null
          id: string
          invitation_sent_at?: string | null
          invitation_token?: string | null
          last_name?: string | null
          notes?: string | null
          organization_id?: string | null
          phone_number?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          schedule?: Json | null
          state_province?: string | null
          status?: string | null
          street_address?: string | null
          technician_settings?: Json | null
          updated_at?: string
        }
        Update: {
          calendar_settings?: Json | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_role_id?: string | null
          first_name?: string | null
          hire_date?: string | null
          id?: string
          invitation_sent_at?: string | null
          invitation_token?: string | null
          last_name?: string | null
          notes?: string | null
          organization_id?: string | null
          phone_number?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          schedule?: Json | null
          state_province?: string | null
          status?: string | null
          street_address?: string | null
          technician_settings?: Json | null
          updated_at?: string
        }
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
          },
        ]
      }
      regions: {
        Row: {
          country_id: string
          id: string
          name: string
          type: string
        }
        Insert: {
          country_id: string
          id: string
          name: string
          type: string
        }
        Update: {
          country_id?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "regions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          custom_role_id: string | null
          id: string
          organization_id: string
          permission: string
          role_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_role_id?: string | null
          id?: string
          organization_id: string
          permission: string
          role_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_role_id?: string | null
          id?: string
          organization_id?: string
          permission?: string
          role_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_certifications: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          name: string
          organization_id: string | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name: string
          organization_id?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name?: string
          organization_id?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_certifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_certifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_specialties: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_specialties_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_specialty_assignments: {
        Row: {
          created_at: string
          id: string
          specialty_id: string
          technician_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          specialty_id: string
          technician_id: string
        }
        Update: {
          created_at?: string
          id?: string
          specialty_id?: string
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_specialty_assignments_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "technician_specialties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_specialty_assignments_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      user_role:
        | "owner"
        | "management"
        | "technician"
        | "service_advisor"
        | "parts"
        | "hr"
        | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
