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
      amazon_associates_settings: {
        Row: {
          auto_link_enabled: boolean | null
          created_at: string | null
          default_marketplace: string | null
          id: string
          integration_connection_id: string | null
          organization_id: string
          tracking_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          auto_link_enabled?: boolean | null
          created_at?: string | null
          default_marketplace?: string | null
          id?: string
          integration_connection_id?: string | null
          organization_id: string
          tracking_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auto_link_enabled?: boolean | null
          created_at?: string | null
          default_marketplace?: string | null
          id?: string
          integration_connection_id?: string | null
          organization_id?: string
          tracking_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "amazon_associates_settings_integration_connection_id_fkey"
            columns: ["integration_connection_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          type: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          type: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          type?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      chat_messages: {
        Row: {
          content: string
          content_type: string
          created_at: string
          file_url: string | null
          id: string
          job_id: string | null
          metadata: Json | null
          room_id: string
          sender_id: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          content: string
          content_type?: string
          created_at?: string
          file_url?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          room_id: string
          sender_id: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          file_url?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          room_id?: string
          sender_id?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          organization_id: string
          read_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          organization_id: string
          read_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          organization_id?: string
          read_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          joined_at: string
          last_read_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          last_read_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          last_read_at?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          id: string
          is_private: boolean | null
          last_message_at: string | null
          metadata: Json | null
          name: string | null
          organization_id: string
          room_type: string | null
          type: string
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_private?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          name?: string | null
          organization_id: string
          room_type?: string | null
          type: string
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_private?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          name?: string | null
          organization_id?: string
          room_type?: string | null
          type?: string
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_rooms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_rooms_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      color_preferences: {
        Row: {
          created_at: string
          id: string
          organization_id: string | null
          primary_color: string
          secondary_color: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id?: string | null
          primary_color?: string
          secondary_color?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string | null
          primary_color?: string
          secondary_color?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "color_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      customer_attachments: {
        Row: {
          created_at: string
          customer_id: string | null
          file_name: string
          file_url: string
          id: string
          original_message_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          file_name: string
          file_url: string
          id?: string
          original_message_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          file_name?: string
          file_url?: string
          id?: string
          original_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_attachments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_attachments_original_message_id_fkey"
            columns: ["original_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_attachments_original_message_id_fkey"
            columns: ["original_message_id"]
            isOneToOne: false
            referencedRelation: "work_order_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_communications: {
        Row: {
          content: string
          customer_id: string | null
          id: string
          metadata: Json | null
          organization_id: string
          sent_at: string
          sent_by: string
          status: string
          type: string
        }
        Insert: {
          content: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          sent_at?: string
          sent_by: string
          status?: string
          type: string
        }
        Update: {
          content?: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          sent_at?: string
          sent_by?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_communications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_communications_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_history: {
        Row: {
          change_type: string
          changed_by: string
          created_at: string
          customer_id: string
          field_name: string
          id: string
          new_value: string | null
          notes: string | null
          old_value: string | null
        }
        Insert: {
          change_type: string
          changed_by: string
          created_at?: string
          customer_id: string
          field_name: string
          id?: string
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
        }
        Update: {
          change_type?: string
          changed_by?: string
          created_at?: string
          customer_id?: string
          field_name?: string
          id?: string
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_history_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_inspections: {
        Row: {
          created_at: string
          customer_id: string | null
          findings: Json
          id: string
          inspection_type: string
          organization_id: string
          performed_by: string
          photos: string[] | null
          recommendations: Json | null
          repair_job_id: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          findings: Json
          id?: string
          inspection_type: string
          organization_id: string
          performed_by: string
          photos?: string[] | null
          recommendations?: Json | null
          repair_job_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          findings?: Json
          id?: string
          inspection_type?: string
          organization_id?: string
          performed_by?: string
          photos?: string[] | null
          recommendations?: Json | null
          repair_job_id?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_inspections_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_inspections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_inspections_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_inspections_repair_job_id_fkey"
            columns: ["repair_job_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_inspections_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_loyalty_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          created_by: string
          customer_id: string
          description: string | null
          id: string
          organization_id: string
          points_earned: number
          points_redeemed: number | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          created_by: string
          customer_id: string
          description?: string | null
          id?: string
          organization_id: string
          points_earned: number
          points_redeemed?: number | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          created_by?: string
          customer_id?: string
          description?: string | null
          id?: string
          organization_id?: string
          points_earned?: number
          points_redeemed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_loyalty_activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_loyalty_activities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_loyalty_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          customer_id: string | null
          id: string
          organization_id: string
          payment_date: string
          payment_method: string
          repair_job_id: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          customer_id?: string | null
          id?: string
          organization_id: string
          payment_date: string
          payment_method: string
          repair_job_id?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          customer_id?: string | null
          id?: string
          organization_id?: string
          payment_date?: string
          payment_method?: string
          repair_job_id?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_payments_repair_job_id_fkey"
            columns: ["repair_job_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_repair_jobs: {
        Row: {
          actual_amount: number | null
          approved_amount: number | null
          approved_at: string | null
          assigned_technician_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          customer_id: string | null
          description: string
          id: string
          job_type: string
          organization_id: string
          quoted_amount: number | null
          quoted_at: string | null
          status: string
          updated_at: string
          updated_by: string
          vehicle_id: string | null
        }
        Insert: {
          actual_amount?: number | null
          approved_amount?: number | null
          approved_at?: string | null
          assigned_technician_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          customer_id?: string | null
          description: string
          id?: string
          job_type: string
          organization_id: string
          quoted_amount?: number | null
          quoted_at?: string | null
          status?: string
          updated_at?: string
          updated_by: string
          vehicle_id?: string | null
        }
        Update: {
          actual_amount?: number | null
          approved_amount?: number | null
          approved_at?: string | null
          assigned_technician_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          customer_id?: string | null
          description?: string
          id?: string
          job_type?: string
          organization_id?: string
          quoted_amount?: number | null
          quoted_at?: string | null
          status?: string
          updated_at?: string
          updated_by?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_repair_jobs_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_repair_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_repair_jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_repair_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_repair_jobs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_repair_jobs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          auth_id: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string
          customer_type: string
          email: string | null
          first_name: string
          id: string
          last_login: string | null
          last_name: string
          lifetime_points: number | null
          loyalty_join_date: string | null
          loyalty_points: number | null
          loyalty_tier: string | null
          notes: string | null
          organization_id: string
          phone_number: string | null
          portal_access_enabled: boolean | null
          postal_code: string | null
          state_province: string | null
          street_address: string | null
          total_spend: number | null
          updated_at: string
          updated_by: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_vin: string | null
          vehicle_year: string | null
        }
        Insert: {
          auth_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by: string
          customer_type?: string
          email?: string | null
          first_name: string
          id?: string
          last_login?: string | null
          last_name: string
          lifetime_points?: number | null
          loyalty_join_date?: string | null
          loyalty_points?: number | null
          loyalty_tier?: string | null
          notes?: string | null
          organization_id: string
          phone_number?: string | null
          portal_access_enabled?: boolean | null
          postal_code?: string | null
          state_province?: string | null
          street_address?: string | null
          total_spend?: number | null
          updated_at?: string
          updated_by: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
        }
        Update: {
          auth_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          customer_type?: string
          email?: string | null
          first_name?: string
          id?: string
          last_login?: string | null
          last_name?: string
          lifetime_points?: number | null
          loyalty_join_date?: string | null
          loyalty_points?: number | null
          loyalty_tier?: string | null
          notes?: string | null
          organization_id?: string
          phone_number?: string | null
          portal_access_enabled?: boolean | null
          postal_code?: string | null
          state_province?: string | null
          street_address?: string | null
          total_spend?: number | null
          updated_at?: string
          updated_by?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_connections: {
        Row: {
          created_at: string
          id: string
          integration_id: string
          last_sync_at: string | null
          organization_id: string
          settings: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id: string
          last_sync_at?: string | null
          organization_id: string
          settings?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string
          last_sync_at?: string | null
          organization_id?: string
          settings?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_connections_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          category: string
          created_at: string
          description: string | null
          documentation_url: string | null
          id: string
          integration_key: string
          name: string
          organization_id: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          integration_key: string
          name: string
          organization_id: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          integration_key?: string
          name?: string
          organization_id?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_history: {
        Row: {
          change_type: string
          created_at: string | null
          created_by: string | null
          id: string
          inventory_item_id: string | null
          new_value: Json | null
          notes: string | null
          old_value: Json | null
          organization_id: string
          quantity_change: number | null
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          change_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id?: string | null
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
          organization_id: string
          quantity_change?: number | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          change_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id?: string | null
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
          organization_id?: string
          quantity_change?: number | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_history_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          barcode: string | null
          category_id: string | null
          condition: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          location: string | null
          manufacturer: string | null
          name: string
          organization_id: string
          quantity_in_stock: number | null
          reorder_point: number | null
          reorder_quantity: number | null
          selling_price: number | null
          sku: string | null
          status: string | null
          subcategory: string | null
          supplier_id: string | null
          unit_cost: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          manufacturer?: string | null
          name: string
          organization_id: string
          quantity_in_stock?: number | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          selling_price?: number | null
          sku?: string | null
          status?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          unit_cost?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          location?: string | null
          manufacturer?: string | null
          name?: string
          organization_id?: string
          quantity_in_stock?: number | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          selling_price?: number | null
          sku?: string | null
          status?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          unit_cost?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "inventory_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_suppliers: {
        Row: {
          address: string | null
          average_markup: number | null
          contact_person: string | null
          created_at: string | null
          credit_limit: number | null
          currency: string | null
          discount_terms: Json | null
          email: string | null
          fulfillment_rate: number | null
          id: string
          last_order_date: string | null
          last_payment_date: string | null
          name: string
          notes: string | null
          organization_id: string | null
          payment_history: Json | null
          payment_method: string | null
          payment_status: string | null
          payment_terms: Json | null
          phone: string | null
          preferred_communication_method: string | null
          rating: number | null
          rebate_terms: Json | null
          reliability_score: number | null
          status: string | null
          tax_id: string | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          average_markup?: number | null
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          currency?: string | null
          discount_terms?: Json | null
          email?: string | null
          fulfillment_rate?: number | null
          id?: string
          last_order_date?: string | null
          last_payment_date?: string | null
          name: string
          notes?: string | null
          organization_id?: string | null
          payment_history?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          payment_terms?: Json | null
          phone?: string | null
          preferred_communication_method?: string | null
          rating?: number | null
          rebate_terms?: Json | null
          reliability_score?: number | null
          status?: string | null
          tax_id?: string | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          average_markup?: number | null
          contact_person?: string | null
          created_at?: string | null
          credit_limit?: number | null
          currency?: string | null
          discount_terms?: Json | null
          email?: string | null
          fulfillment_rate?: number | null
          id?: string
          last_order_date?: string | null
          last_payment_date?: string | null
          name?: string
          notes?: string | null
          organization_id?: string | null
          payment_history?: Json | null
          payment_method?: string | null
          payment_status?: string | null
          payment_terms?: Json | null
          phone?: string | null
          preferred_communication_method?: string | null
          rating?: number | null
          rebate_terms?: Json | null
          reliability_score?: number | null
          status?: string | null
          tax_id?: string | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      job_templates: {
        Row: {
          category: Database["public"]["Enums"]["job_category"]
          created_at: string
          created_by: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          is_active: boolean | null
          job_number: string | null
          name: string
          organization_id: string | null
          parts_required: Json | null
          status: Database["public"]["Enums"]["job_status"] | null
          sub_tasks: Json | null
          timeline: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["job_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          job_number?: string | null
          name: string
          organization_id?: string | null
          parts_required?: Json | null
          status?: Database["public"]["Enums"]["job_status"] | null
          sub_tasks?: Json | null
          timeline?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["job_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          job_number?: string | null
          name?: string
          organization_id?: string | null
          parts_required?: Json | null
          status?: Database["public"]["Enums"]["job_status"] | null
          sub_tasks?: Json | null
          timeline?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_templates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      pinned_messages: {
        Row: {
          id: string
          message_id: string | null
          organization_id: string
          pinned_at: string | null
          pinned_by: string | null
          room_id: string | null
        }
        Insert: {
          id?: string
          message_id?: string | null
          organization_id: string
          pinned_at?: string | null
          pinned_by?: string | null
          room_id?: string | null
        }
        Update: {
          id?: string
          message_id?: string | null
          organization_id?: string
          pinned_at?: string | null
          pinned_by?: string | null
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pinned_messages_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pinned_messages_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "work_order_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pinned_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pinned_messages_pinned_by_fkey"
            columns: ["pinned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pinned_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          calendar_settings: Json | null
          certifications: Json[] | null
          city: string | null
          color_preferences: Json | null
          country: string | null
          created_at: string
          custom_role_id: string | null
          emergency_contact: Json | null
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
          preferred_working_hours: Json | null
          role: Database["public"]["Enums"]["user_role"]
          schedule: Json | null
          skills: string[] | null
          state_province: string | null
          status: string | null
          street_address: string | null
          technician_settings: Json | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          calendar_settings?: Json | null
          certifications?: Json[] | null
          city?: string | null
          color_preferences?: Json | null
          country?: string | null
          created_at?: string
          custom_role_id?: string | null
          emergency_contact?: Json | null
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
          preferred_working_hours?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          schedule?: Json | null
          skills?: string[] | null
          state_province?: string | null
          status?: string | null
          street_address?: string | null
          technician_settings?: Json | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          calendar_settings?: Json | null
          certifications?: Json[] | null
          city?: string | null
          color_preferences?: Json | null
          country?: string | null
          created_at?: string
          custom_role_id?: string | null
          emergency_contact?: Json | null
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
          preferred_working_hours?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          schedule?: Json | null
          skills?: string[] | null
          state_province?: string | null
          status?: string | null
          street_address?: string | null
          technician_settings?: Json | null
          theme_preference?: string | null
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
      skill_assessment_history: {
        Row: {
          assessment_id: string | null
          change_type: string
          changed_by: string | null
          created_at: string
          field_name: string | null
          id: string
          new_value: string | null
          notes: string | null
          old_value: string | null
          organization_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          change_type: string
          changed_by?: string | null
          created_at?: string
          field_name?: string | null
          id?: string
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          organization_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          change_type?: string
          changed_by?: string | null
          created_at?: string
          field_name?: string | null
          id?: string
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessment_history_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "skill_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_assessment_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_assessment_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_assessments: {
        Row: {
          assessed_by: string | null
          assessment_date: string | null
          created_at: string
          id: string
          notes: string | null
          organization_id: string | null
          proficiency_level: number
          profile_id: string | null
          skill_id: string | null
          updated_at: string
        }
        Insert: {
          assessed_by?: string | null
          assessment_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          proficiency_level: number
          profile_id?: string | null
          skill_id?: string | null
          updated_at?: string
        }
        Update: {
          assessed_by?: string | null
          assessment_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          proficiency_level?: number
          profile_id?: string | null
          skill_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessments_assessed_by_fkey"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_assessments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_assessments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_certification_reminders: {
        Row: {
          certification_id: string | null
          created_at: string | null
          id: string
          organization_id: string | null
          profile_id: string | null
          reminder_date: string
          reminder_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          certification_id?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          profile_id?: string | null
          reminder_date: string
          reminder_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          certification_id?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          profile_id?: string | null
          reminder_date?: string
          reminder_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_certification_reminders_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "staff_certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_certification_reminders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_certification_reminders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      staff_communication_logs: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          message_content: string
          message_type: string
          organization_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          message_content: string
          message_type: string
          organization_id: string
          profile_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          message_content?: string
          message_type?: string
          organization_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_communication_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_communication_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_communication_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_history: {
        Row: {
          change_type: string
          changed_by: string | null
          created_at: string
          entity_id: string
          entity_type: string
          field_name: string | null
          id: string
          new_value: string | null
          notes: string | null
          old_value: string | null
          organization_id: string | null
          profile_id: string | null
        }
        Insert: {
          change_type: string
          changed_by?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          field_name?: string | null
          id?: string
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          organization_id?: string | null
          profile_id?: string | null
        }
        Update: {
          change_type?: string
          changed_by?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          field_name?: string | null
          id?: string
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          organization_id?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_performance_metrics: {
        Row: {
          created_at: string | null
          customer_satisfaction_score: number | null
          efficiency_score: number | null
          id: string
          jobs_completed: number | null
          metric_date: string
          notes: string | null
          organization_id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_satisfaction_score?: number | null
          efficiency_score?: number | null
          id?: string
          jobs_completed?: number | null
          metric_date: string
          notes?: string | null
          organization_id: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_satisfaction_score?: number | null
          efficiency_score?: number | null
          id?: string
          jobs_completed?: number | null
          metric_date?: string
          notes?: string | null
          organization_id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_performance_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_performance_metrics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_skill_assessments: {
        Row: {
          assessed_by: string | null
          assessment_date: string | null
          created_at: string | null
          id: string
          notes: string | null
          organization_id: string | null
          proficiency_level: number
          profile_id: string | null
          skill_id: string | null
          updated_at: string | null
        }
        Insert: {
          assessed_by?: string | null
          assessment_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          proficiency_level: number
          profile_id?: string | null
          skill_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assessed_by?: string | null
          assessment_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          proficiency_level?: number
          profile_id?: string | null
          skill_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_skill_assessments_assessed_by_fkey"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_skill_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_skill_assessments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_skill_assessments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_time_off: {
        Row: {
          created_at: string | null
          created_by: string
          end_date: string
          id: string
          notes: string | null
          organization_id: string
          profile_id: string
          start_date: string
          status: Database["public"]["Enums"]["time_off_status"] | null
          type: Database["public"]["Enums"]["time_off_type"]
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          end_date: string
          id?: string
          notes?: string | null
          organization_id: string
          profile_id: string
          start_date: string
          status?: Database["public"]["Enums"]["time_off_status"] | null
          type: Database["public"]["Enums"]["time_off_type"]
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          end_date?: string
          id?: string
          notes?: string | null
          organization_id?: string
          profile_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["time_off_status"] | null
          type?: Database["public"]["Enums"]["time_off_type"]
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_time_off_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_time_off_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_time_off_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_time_off_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_training: {
        Row: {
          completion_date: string | null
          created_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          organization_id: string
          profile_id: string
          status: string | null
          training_name: string
          updated_at: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          organization_id: string
          profile_id: string
          status?: string | null
          training_name: string
          updated_at?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          organization_id?: string
          profile_id?: string
          status?: string | null
          training_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_training_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_training_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_work_history: {
        Row: {
          completion_time: string | null
          created_at: string | null
          id: string
          job_type: string
          notes: string | null
          organization_id: string | null
          performance_rating: number | null
          profile_id: string | null
          start_time: string | null
          updated_at: string | null
          work_order_id: string | null
        }
        Insert: {
          completion_time?: string | null
          created_at?: string | null
          id?: string
          job_type: string
          notes?: string | null
          organization_id?: string | null
          performance_rating?: number | null
          profile_id?: string | null
          start_time?: string | null
          updated_at?: string | null
          work_order_id?: string | null
        }
        Update: {
          completion_time?: string | null
          created_at?: string | null
          id?: string
          job_type?: string
          notes?: string | null
          organization_id?: string | null
          performance_rating?: number | null
          profile_id?: string | null
          start_time?: string | null
          updated_at?: string | null
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_work_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_work_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_analytics: {
        Row: {
          average_delivery_time: number | null
          average_lead_time: number | null
          bill_out_total: number | null
          contract_compliance_rate: number | null
          cost_savings_initiatives: Json | null
          created_at: string | null
          daily_spend: number | null
          date: string
          defect_rate: number | null
          delivery_time_trend: number[] | null
          discounts_amount: number | null
          early_payment_discounts: number | null
          id: string
          inventory_value: number | null
          market_price_variance: number | null
          monthly_spend: number | null
          negotiated_savings: number | null
          on_time_delivery_rate: number | null
          order_value_trend: number[] | null
          orders_count: number | null
          orders_fulfilled: number | null
          organization_id: string | null
          payment_terms_compliance: number | null
          payment_timeliness_score: number | null
          profit_margin: number | null
          quality_rating: number | null
          rebates_amount: number | null
          return_rate: number | null
          seasonal_spend_pattern: Json | null
          supplier_diversity_status: string | null
          supplier_id: string | null
          supply_chain_risk_score: number | null
          sustainability_score: number | null
          total_spend: number | null
          updated_at: string | null
          volume_discounts: number | null
          weekly_spend: number | null
        }
        Insert: {
          average_delivery_time?: number | null
          average_lead_time?: number | null
          bill_out_total?: number | null
          contract_compliance_rate?: number | null
          cost_savings_initiatives?: Json | null
          created_at?: string | null
          daily_spend?: number | null
          date: string
          defect_rate?: number | null
          delivery_time_trend?: number[] | null
          discounts_amount?: number | null
          early_payment_discounts?: number | null
          id?: string
          inventory_value?: number | null
          market_price_variance?: number | null
          monthly_spend?: number | null
          negotiated_savings?: number | null
          on_time_delivery_rate?: number | null
          order_value_trend?: number[] | null
          orders_count?: number | null
          orders_fulfilled?: number | null
          organization_id?: string | null
          payment_terms_compliance?: number | null
          payment_timeliness_score?: number | null
          profit_margin?: number | null
          quality_rating?: number | null
          rebates_amount?: number | null
          return_rate?: number | null
          seasonal_spend_pattern?: Json | null
          supplier_diversity_status?: string | null
          supplier_id?: string | null
          supply_chain_risk_score?: number | null
          sustainability_score?: number | null
          total_spend?: number | null
          updated_at?: string | null
          volume_discounts?: number | null
          weekly_spend?: number | null
        }
        Update: {
          average_delivery_time?: number | null
          average_lead_time?: number | null
          bill_out_total?: number | null
          contract_compliance_rate?: number | null
          cost_savings_initiatives?: Json | null
          created_at?: string | null
          daily_spend?: number | null
          date?: string
          defect_rate?: number | null
          delivery_time_trend?: number[] | null
          discounts_amount?: number | null
          early_payment_discounts?: number | null
          id?: string
          inventory_value?: number | null
          market_price_variance?: number | null
          monthly_spend?: number | null
          negotiated_savings?: number | null
          on_time_delivery_rate?: number | null
          order_value_trend?: number[] | null
          orders_count?: number | null
          orders_fulfilled?: number | null
          organization_id?: string | null
          payment_terms_compliance?: number | null
          payment_timeliness_score?: number | null
          profit_margin?: number | null
          quality_rating?: number | null
          rebates_amount?: number | null
          return_rate?: number | null
          seasonal_spend_pattern?: Json | null
          supplier_diversity_status?: string | null
          supplier_id?: string | null
          supply_chain_risk_score?: number | null
          sustainability_score?: number | null
          total_spend?: number | null
          updated_at?: string | null
          volume_discounts?: number | null
          weekly_spend?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_analytics_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "inventory_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_automation_settings: {
        Row: {
          auto_payment: boolean | null
          auto_reorder: boolean | null
          contract_reminder_days: number | null
          created_at: string | null
          id: string
          min_stock_threshold: number | null
          notification_preferences: Json | null
          organization_id: string | null
          payment_reminder_days: number | null
          preferred_delivery_days: string[] | null
          reorder_threshold: number | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          auto_payment?: boolean | null
          auto_reorder?: boolean | null
          contract_reminder_days?: number | null
          created_at?: string | null
          id?: string
          min_stock_threshold?: number | null
          notification_preferences?: Json | null
          organization_id?: string | null
          payment_reminder_days?: number | null
          preferred_delivery_days?: string[] | null
          reorder_threshold?: number | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_payment?: boolean | null
          auto_reorder?: boolean | null
          contract_reminder_days?: number | null
          created_at?: string | null
          id?: string
          min_stock_threshold?: number | null
          notification_preferences?: Json | null
          organization_id?: string | null
          payment_reminder_days?: number | null
          preferred_delivery_days?: string[] | null
          reorder_threshold?: number | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_automation_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_automation_settings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "inventory_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_communications: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          due_date: string | null
          id: string
          message_content: string
          message_type: string
          organization_id: string | null
          priority: string | null
          read_at: string | null
          response_required: boolean | null
          status: string | null
          supplier_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          message_content: string
          message_type: string
          organization_id?: string | null
          priority?: string | null
          read_at?: string | null
          response_required?: boolean | null
          status?: string | null
          supplier_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          message_content?: string
          message_type?: string
          organization_id?: string | null
          priority?: string | null
          read_at?: string | null
          response_required?: boolean | null
          status?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_communications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_communications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_communications_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "inventory_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_detailed_transactions: {
        Row: {
          amount: number
          bill_out_price: number | null
          cost_price: number | null
          created_at: string | null
          created_by: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          organization_id: string | null
          payment_date: string | null
          payment_status: string | null
          rebate_amount: number | null
          supplier_id: string | null
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          bill_out_price?: number | null
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          payment_date?: string | null
          payment_status?: string | null
          rebate_amount?: number | null
          supplier_id?: string | null
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          bill_out_price?: number | null
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          payment_date?: string | null
          payment_status?: string | null
          rebate_amount?: number | null
          supplier_id?: string | null
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_detailed_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_detailed_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_detailed_transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "inventory_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_documents: {
        Row: {
          document_type: string
          file_name: string
          file_url: string
          id: string
          notes: string | null
          organization_id: string | null
          status: string | null
          supplier_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          document_type: string
          file_name: string
          file_url: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          status?: string | null
          supplier_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          document_type?: string
          file_name?: string
          file_url?: string
          id?: string
          notes?: string | null
          organization_id?: string | null
          status?: string | null
          supplier_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "inventory_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_history: {
        Row: {
          change_type: string
          changed_at: string | null
          changed_by: string | null
          field_name: string
          id: string
          new_value: string | null
          notes: string | null
          old_value: string | null
          organization_id: string | null
          supplier_id: string | null
        }
        Insert: {
          change_type: string
          changed_at?: string | null
          changed_by?: string | null
          field_name: string
          id?: string
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          organization_id?: string | null
          supplier_id?: string | null
        }
        Update: {
          change_type?: string
          changed_at?: string | null
          changed_by?: string | null
          field_name?: string
          id?: string
          new_value?: string | null
          notes?: string | null
          old_value?: string | null
          organization_id?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_history_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "inventory_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_transactions: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          currency: string | null
          id: string
          notes: string | null
          organization_id: string | null
          payment_method: string | null
          reference_number: string | null
          status: string | null
          supplier_id: string | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          payment_method?: string | null
          reference_number?: string | null
          status?: string | null
          supplier_id?: string | null
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          payment_method?: string | null
          reference_number?: string | null
          status?: string | null
          supplier_id?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "inventory_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      system_configuration: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      technician_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean
          organization_id: string
          reason: string | null
          technician_id: string
          time_slots: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          organization_id: string
          reason?: string | null
          technician_id: string
          time_slots?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          organization_id?: string
          reason?: string | null
          technician_id?: string
          time_slots?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_availability_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_availability_technician_id_fkey"
            columns: ["technician_id"]
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
      training_requests: {
        Row: {
          approval_date: string | null
          approval_status: string | null
          approved_by: string | null
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          organization_id: string | null
          priority: string | null
          profile_id: string | null
          requested_by: string | null
          requested_completion_date: string | null
          status: string
          training_type: string
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approval_status?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          priority?: string | null
          profile_id?: string | null
          requested_by?: string | null
          requested_completion_date?: string | null
          status?: string
          training_type: string
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approval_status?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          priority?: string | null
          profile_id?: string | null
          requested_by?: string | null
          requested_completion_date?: string | null
          status?: string
          training_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_models_reference: {
        Row: {
          created_at: string
          id: string
          make: string
          model: string
          organization_id: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          make: string
          model: string
          organization_id: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          make?: string
          model?: string
          organization_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_models_reference_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          body_class: string | null
          created_at: string
          created_by: string
          customer_id: string
          engine_info: Json | null
          id: string
          make: string | null
          model: string | null
          organization_id: string
          trim: string | null
          updated_at: string
          updated_by: string
          vin: string | null
          year: string | null
        }
        Insert: {
          body_class?: string | null
          created_at?: string
          created_by: string
          customer_id: string
          engine_info?: Json | null
          id?: string
          make?: string | null
          model?: string | null
          organization_id: string
          trim?: string | null
          updated_at?: string
          updated_by: string
          vin?: string | null
          year?: string | null
        }
        Update: {
          body_class?: string | null
          created_at?: string
          created_by?: string
          customer_id?: string
          engine_info?: Json | null
          id?: string
          make?: string | null
          model?: string | null
          organization_id?: string
          trim?: string | null
          updated_at?: string
          updated_by?: string
          vin?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_assignment_rules: {
        Row: {
          created_at: string
          created_by: string | null
          criteria: Json
          id: string
          is_active: boolean
          name: string
          organization_id: string
          priority: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          criteria?: Json
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          priority?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          criteria?: Json
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          priority?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_order_assignment_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_assignment_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_assignment_rules_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_url: string
          id: string
          original_message_id: string | null
          work_order_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          original_message_id?: string | null
          work_order_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          original_message_id?: string | null
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_attachments_original_message_id_fkey"
            columns: ["original_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_attachments_original_message_id_fkey"
            columns: ["original_message_id"]
            isOneToOne: false
            referencedRelation: "work_order_messages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      work_order_messages: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string | null
          file_url: string | null
          id: string | null
          job_id: string | null
          metadata: Json | null
          room_id: string | null
          sender_first_name: string | null
          sender_id: string | null
          sender_last_name: string | null
          updated_at: string | null
          vehicle_id: string | null
          work_order_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_rooms_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      auto_assign_technician: {
        Args: {
          booking_id: string
          required_specialties?: string[]
        }
        Returns: string
      }
      check_organization_membership: {
        Args: {
          user_id: string
          org_id: string
        }
        Returns: boolean
      }
      get_organization_user_emails: {
        Args: {
          org_id: string
        }
        Returns: {
          user_id: string
          email: string
        }[]
      }
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          table_type: string
          size: string
        }[]
      }
      get_user_organization_id: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      reset_staff_password: {
        Args: {
          staff_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      booking_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      chat_room_type:
        | "general"
        | "support"
        | "announcements"
        | "team"
        | "project"
        | "sales"
        | "marketing"
        | "engineering"
        | "customer-service"
        | "operations"
        | "hr"
        | "finance"
        | "it"
        | "training"
        | "events"
      job_category:
        | "Steering"
        | "Suspension"
        | "Brakes"
        | "Transmission"
        | "Engine"
        | "Electrical"
        | "HVAC"
        | "General"
      job_status: "pending" | "in_progress" | "completed" | "cancelled"
      job_template_category:
        | "maintenance"
        | "repair"
        | "diagnostic"
        | "inspection"
        | "custom"
      time_off_status: "pending" | "approved" | "rejected"
      time_off_type: "vacation" | "sick" | "personal" | "training"
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
