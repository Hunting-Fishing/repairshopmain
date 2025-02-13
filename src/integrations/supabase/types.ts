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
      amazon_api_requests: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          marketplace: string | null
          operation: string
          organization_id: string | null
          request_details: Json | null
          response_time: number | null
          status: string
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          marketplace?: string | null
          operation: string
          organization_id?: string | null
          request_details?: Json | null
          response_time?: number | null
          status: string
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          marketplace?: string | null
          operation?: string
          organization_id?: string | null
          request_details?: Json | null
          response_time?: number | null
          status?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "amazon_api_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      amazon_associates_settings: {
        Row: {
          api_region: string | null
          api_version: string | null
          auto_link_enabled: boolean | null
          created_at: string | null
          default_marketplace: string | null
          id: string
          integration_connection_id: string | null
          marketplace_endpoints: Json | null
          organization_id: string
          partner_tag: string | null
          partner_type: string | null
          rate_limit_config: Json | null
          request_quota: Json | null
          tracking_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_region?: string | null
          api_version?: string | null
          auto_link_enabled?: boolean | null
          created_at?: string | null
          default_marketplace?: string | null
          id?: string
          integration_connection_id?: string | null
          marketplace_endpoints?: Json | null
          organization_id: string
          partner_tag?: string | null
          partner_type?: string | null
          rate_limit_config?: Json | null
          request_quota?: Json | null
          tracking_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_region?: string | null
          api_version?: string | null
          auto_link_enabled?: boolean | null
          created_at?: string | null
          default_marketplace?: string | null
          id?: string
          integration_connection_id?: string | null
          marketplace_endpoints?: Json | null
          organization_id?: string
          partner_tag?: string | null
          partner_type?: string | null
          rate_limit_config?: Json | null
          request_quota?: Json | null
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
      booking_history: {
        Row: {
          booking_id: string
          change_type: string
          changed_by: string
          created_at: string | null
          id: string
          new_data: Json | null
          organization_id: string
          previous_data: Json | null
        }
        Insert: {
          booking_id: string
          change_type: string
          changed_by: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          organization_id: string
          previous_data?: Json | null
        }
        Update: {
          booking_id?: string
          change_type?: string
          changed_by?: string
          created_at?: string | null
          id?: string
          new_data?: Json | null
          organization_id?: string
          previous_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_notifications: {
        Row: {
          booking_id: string
          created_at: string | null
          error: string | null
          id: string
          organization_id: string
          sent_at: string | null
          status: string
          type: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          error?: string | null
          id?: string
          organization_id: string
          sent_at?: string | null
          status?: string
          type: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          error?: string | null
          id?: string
          organization_id?: string
          sent_at?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_types: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          duration: unknown | null
          id: string
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          duration?: unknown | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          duration?: unknown | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          assigned_technician_id: string | null
          color: string | null
          created_at: string
          created_by: string
          customer_name: string
          duration_minutes: number
          email: string | null
          end_time: string
          estimated_cost: number | null
          id: string
          is_demo: boolean | null
          is_multi_day: boolean | null
          job_description: string
          last_status_change: string | null
          last_updated_by: string | null
          notes: string | null
          notification_preferences: Json | null
          organization_id: string
          parent_booking_id: string | null
          phone_number: string | null
          priority: string | null
          remaining_minutes: number | null
          repair_job_id: string | null
          sequence_number: number | null
          source: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_duration_minutes: number | null
          updated_at: string
          updated_by: string
          vehicle_info: string
        }
        Insert: {
          assigned_technician_id?: string | null
          color?: string | null
          created_at?: string
          created_by: string
          customer_name: string
          duration_minutes?: number
          email?: string | null
          end_time: string
          estimated_cost?: number | null
          id?: string
          is_demo?: boolean | null
          is_multi_day?: boolean | null
          job_description: string
          last_status_change?: string | null
          last_updated_by?: string | null
          notes?: string | null
          notification_preferences?: Json | null
          organization_id: string
          parent_booking_id?: string | null
          phone_number?: string | null
          priority?: string | null
          remaining_minutes?: number | null
          repair_job_id?: string | null
          sequence_number?: number | null
          source?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_duration_minutes?: number | null
          updated_at?: string
          updated_by: string
          vehicle_info: string
        }
        Update: {
          assigned_technician_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string
          customer_name?: string
          duration_minutes?: number
          email?: string | null
          end_time?: string
          estimated_cost?: number | null
          id?: string
          is_demo?: boolean | null
          is_multi_day?: boolean | null
          job_description?: string
          last_status_change?: string | null
          last_updated_by?: string | null
          notes?: string | null
          notification_preferences?: Json | null
          organization_id?: string
          parent_booking_id?: string | null
          phone_number?: string | null
          priority?: string | null
          remaining_minutes?: number | null
          repair_job_id?: string | null
          sequence_number?: number | null
          source?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_duration_minutes?: number | null
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
            foreignKeyName: "bookings_parent_booking_id_fkey"
            columns: ["parent_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_repair_job_id_fkey"
            columns: ["repair_job_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_classifications: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
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
      calendar_settings: {
        Row: {
          business_hours: Json | null
          created_at: string
          id: string
          time_slot_duration: number
          updated_at: string
          user_id: string | null
          working_hours_end: number
          working_hours_start: number
        }
        Insert: {
          business_hours?: Json | null
          created_at?: string
          id?: string
          time_slot_duration?: number
          updated_at?: string
          user_id?: string | null
          working_hours_end?: number
          working_hours_start?: number
        }
        Update: {
          business_hours?: Json | null
          created_at?: string
          id?: string
          time_slot_duration?: number
          updated_at?: string
          user_id?: string | null
          working_hours_end?: number
          working_hours_start?: number
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
          metadata: Json | null
          room_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          content_type?: string
          created_at?: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          room_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          room_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
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
      communication_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          last_used_at: string | null
          name: string
          organization_id: string
          status: string | null
          subject: string | null
          type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          last_used_at?: string | null
          name: string
          organization_id: string
          status?: string | null
          subject?: string | null
          type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          last_used_at?: string | null
          name?: string
          organization_id?: string
          status?: string | null
          subject?: string | null
          type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_templates_organization_id_fkey"
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
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_attachments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
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
      customer_communication_preferences: {
        Row: {
          channel: string
          customer_id: string
          frequency: string | null
          id: string
          last_updated: string | null
          opted_in: boolean | null
          organization_id: string
          preferred_time_end: string | null
          preferred_time_start: string | null
        }
        Insert: {
          channel: string
          customer_id: string
          frequency?: string | null
          id?: string
          last_updated?: string | null
          opted_in?: boolean | null
          organization_id: string
          preferred_time_end?: string | null
          preferred_time_start?: string | null
        }
        Update: {
          channel?: string
          customer_id?: string
          frequency?: string | null
          id?: string
          last_updated?: string | null
          opted_in?: boolean | null
          organization_id?: string
          preferred_time_end?: string | null
          preferred_time_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_communication_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_communication_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_communication_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_communication_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
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
          {
            foreignKeyName: "fk_customer_communications_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_data_quality_checks: {
        Row: {
          check_type: string
          created_at: string | null
          customer_id: string
          id: string
          issues: Json | null
          last_checked: string | null
          organization_id: string
          resolution_notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          check_type: string
          created_at?: string | null
          customer_id: string
          id?: string
          issues?: Json | null
          last_checked?: string | null
          organization_id: string
          resolution_notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          check_type?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          issues?: Json | null
          last_checked?: string | null
          organization_id?: string
          resolution_notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_document_versions: {
        Row: {
          changes_description: string | null
          created_at: string | null
          created_by: string
          document_id: string
          file_url: string
          id: string
          version: number
        }
        Insert: {
          changes_description?: string | null
          created_at?: string | null
          created_by: string
          document_id: string
          file_url: string
          id?: string
          version: number
        }
        Update: {
          changes_description?: string | null
          created_at?: string | null
          created_by?: string
          document_id?: string
          file_url?: string
          id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "customer_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_documents: {
        Row: {
          created_at: string | null
          created_by: string
          customer_id: string
          description: string | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          metadata: Json | null
          name: string
          organization_id: string
          status: string | null
          tags: string[] | null
          updated_at: string | null
          updated_by: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          customer_id: string
          description?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          metadata?: Json | null
          name: string
          organization_id: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          customer_id?: string
          description?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_engagement_events: {
        Row: {
          customer_id: string
          event_data: Json | null
          event_type: string
          id: string
          occurred_at: string | null
          organization_id: string
          score: number | null
        }
        Insert: {
          customer_id: string
          event_data?: Json | null
          event_type: string
          id?: string
          occurred_at?: string | null
          organization_id: string
          score?: number | null
        }
        Update: {
          customer_id?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          occurred_at?: string | null
          organization_id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_engagement_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_engagement_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_engagement_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_engagement_scores: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          interaction_counts: Json | null
          last_calculated_at: string | null
          organization_id: string
          total_score: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          interaction_counts?: Json | null
          last_calculated_at?: string | null
          organization_id: string
          total_score?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          interaction_counts?: Json | null
          last_calculated_at?: string | null
          organization_id?: string
          total_score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_engagement_scores_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_engagement_scores_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_engagement_scores_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_engagement_scores_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_feedback: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          customer_id: string
          id: string
          metadata: Json | null
          organization_id: string
          rating: number | null
          resolved_at: string | null
          resolved_by: string | null
          sentiment: string | null
          source: string | null
          status: string | null
          type: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          metadata?: Json | null
          organization_id: string
          rating?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          sentiment?: string | null
          source?: string | null
          status?: string | null
          type: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          rating?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          sentiment?: string | null
          source?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_feedback_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_form_fields: {
        Row: {
          created_at: string | null
          customer_type: string
          field_name: string
          field_type: string
          id: string
          label: string
          organization_id: string
          required: boolean | null
        }
        Insert: {
          created_at?: string | null
          customer_type: string
          field_name: string
          field_type: string
          id?: string
          label: string
          organization_id: string
          required?: boolean | null
        }
        Update: {
          created_at?: string | null
          customer_type?: string
          field_name?: string
          field_type?: string
          id?: string
          label?: string
          organization_id?: string
          required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          new_value: Json | null
          notes: string | null
          old_value: Json | null
        }
        Insert: {
          change_type: string
          changed_by: string
          created_at?: string
          customer_id: string
          field_name: string
          id?: string
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
        }
        Update: {
          change_type?: string
          changed_by?: string
          created_at?: string
          customer_id?: string
          field_name?: string
          id?: string
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
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
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_history_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
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
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_inspections_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
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
      customer_interaction_logs: {
        Row: {
          channel: string
          context: Json | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          duration_seconds: number | null
          id: string
          interaction_type: string
          journey_stage_id: string | null
          metadata: Json | null
          organization_id: string
          outcome: string | null
          sentiment: string | null
        }
        Insert: {
          channel: string
          context?: Json | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          duration_seconds?: number | null
          id?: string
          interaction_type: string
          journey_stage_id?: string | null
          metadata?: Json | null
          organization_id: string
          outcome?: string | null
          sentiment?: string | null
        }
        Update: {
          channel?: string
          context?: Json | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          duration_seconds?: number | null
          id?: string
          interaction_type?: string
          journey_stage_id?: string | null
          metadata?: Json | null
          organization_id?: string
          outcome?: string | null
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_interaction_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_interaction_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_interaction_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_interaction_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_interaction_logs_journey_stage_id_fkey"
            columns: ["journey_stage_id"]
            isOneToOne: false
            referencedRelation: "customer_journey_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_interaction_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_journey_stages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index: number
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_journey_stages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_loyalty_activities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
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
      customer_metrics: {
        Row: {
          calculated_at: string | null
          change_percentage: number | null
          customer_id: string
          id: string
          metadata: Json | null
          metric_type: string
          organization_id: string
          previous_value: number | null
          trend_direction: string | null
          value: number
        }
        Insert: {
          calculated_at?: string | null
          change_percentage?: number | null
          customer_id: string
          id?: string
          metadata?: Json | null
          metric_type: string
          organization_id: string
          previous_value?: number | null
          trend_direction?: string | null
          value?: number
        }
        Update: {
          calculated_at?: string | null
          change_percentage?: number | null
          customer_id?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          organization_id?: string
          previous_value?: number | null
          trend_direction?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          id: string
          is_private: boolean | null
          organization_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          id?: string
          is_private?: boolean | null
          organization_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          id?: string
          is_private?: boolean | null
          organization_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notes_organization_id_fkey"
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
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
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
      customer_portal_settings: {
        Row: {
          allowed_features: string[] | null
          created_at: string | null
          customer_id: string
          id: string
          last_login: string | null
          locked_until: string | null
          login_attempts: number | null
          organization_id: string
          password_last_changed: string | null
          preferences: Json | null
          reset_token: string | null
          reset_token_expires: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          allowed_features?: string[] | null
          created_at?: string | null
          customer_id: string
          id?: string
          last_login?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          organization_id: string
          password_last_changed?: string | null
          preferences?: Json | null
          reset_token?: string | null
          reset_token_expires?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          allowed_features?: string[] | null
          created_at?: string | null
          customer_id?: string
          id?: string
          last_login?: string | null
          locked_until?: string | null
          login_attempts?: number | null
          organization_id?: string
          password_last_changed?: string | null
          preferences?: Json | null
          reset_token?: string | null
          reset_token_expires?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          estimated_duration_minutes: number | null
          id: string
          is_demo: boolean | null
          job_type: string
          organization_id: string
          quoted_amount: number | null
          quoted_at: string | null
          scheduling_status: string | null
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
          estimated_duration_minutes?: number | null
          id?: string
          is_demo?: boolean | null
          job_type: string
          organization_id: string
          quoted_amount?: number | null
          quoted_at?: string | null
          scheduling_status?: string | null
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
          estimated_duration_minutes?: number | null
          id?: string
          is_demo?: boolean | null
          job_type?: string
          organization_id?: string
          quoted_amount?: number | null
          quoted_at?: string | null
          scheduling_status?: string | null
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
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_repair_jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
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
          {
            foreignKeyName: "fk_repair_jobs_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segment_assignments: {
        Row: {
          assigned_at: string | null
          customer_id: string
          id: string
          segment_id: string
        }
        Insert: {
          assigned_at?: string | null
          customer_id: string
          id?: string
          segment_id: string
        }
        Update: {
          assigned_at?: string | null
          customer_id?: string
          id?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_segment_assignments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_segment_assignments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_segment_assignments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_segment_assignments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segments: {
        Row: {
          created_at: string | null
          criteria: Json
          customer_count: number | null
          description: string | null
          id: string
          last_run_at: string | null
          name: string
          organization_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          customer_count?: number | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          name: string
          organization_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          customer_count?: number | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          name?: string
          organization_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_segments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_tag_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string
          customer_id: string
          tag_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by: string
          customer_id: string
          tag_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string
          customer_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_tag_assignments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_tag_assignments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_tag_assignments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "customer_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_tags: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_tags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_tax_info: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          organization_id: string
          tax_id: string | null
          tax_type: string | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          organization_id: string
          tax_id?: string | null
          tax_type?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          organization_id?: string
          tax_id?: string | null
          tax_type?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_validation_logs: {
        Row: {
          created_at: string | null
          customer_id: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          organization_id: string
          status: Database["public"]["Enums"]["validation_status"]
          validation_type: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          status: Database["public"]["Enums"]["validation_status"]
          validation_type: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          status?: Database["public"]["Enums"]["validation_status"]
          validation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_validation_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_validation_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_validation_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_welcome_sequence: {
        Row: {
          conditions: Json | null
          created_at: string | null
          delay_hours: number | null
          id: string
          is_active: boolean | null
          message_type: string
          organization_id: string
          sequence_step: number
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          message_type: string
          organization_id: string
          sequence_step: number
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          message_type?: string
          organization_id?: string
          sequence_step?: number
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_welcome_sequence_tracking: {
        Row: {
          created_at: string | null
          customer_id: string
          error_message: string | null
          id: string
          organization_id: string
          scheduled_for: string
          sent_at: string | null
          sequence_step_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          error_message?: string | null
          id?: string
          organization_id: string
          scheduled_for: string
          sent_at?: string | null
          sequence_step_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          error_message?: string | null
          id?: string
          organization_id?: string
          scheduled_for?: string
          sent_at?: string | null
          sequence_step_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address_book: Json | null
          address_validation_status:
            | Database["public"]["Enums"]["validation_status"]
            | null
          address_verified: boolean | null
          auth_id: string | null
          business_classification_id: string | null
          city: string | null
          communication_preferences: Json | null
          company_size: string | null
          country: string | null
          created_at: string
          created_by: string
          customer_since: string | null
          customer_type: string
          email: string | null
          email_validation_status:
            | Database["public"]["Enums"]["validation_status"]
            | null
          email_verified: boolean | null
          first_name: string
          id: string
          language_preference: string | null
          last_login: string | null
          last_name: string
          last_visit_date: string | null
          lifetime_points: number | null
          lifetime_value: number | null
          loyalty_join_date: string | null
          loyalty_points: number | null
          loyalty_tier: string | null
          marketing_preferences: Json | null
          notes: string | null
          organization_id: string
          phone_number: string | null
          phone_validation_status:
            | Database["public"]["Enums"]["validation_status"]
            | null
          phone_verified: boolean | null
          portal_access_enabled: boolean | null
          postal_code: string | null
          preferred_contact_time: string | null
          secondary_contact: Json | null
          state_province: string | null
          status: string
          street_address: string | null
          tags: string[] | null
          timezone: string | null
          total_spend: number | null
          updated_at: string
          updated_by: string
          validation_errors: Json | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_vin: string | null
          vehicle_year: string | null
          visit_count: number | null
        }
        Insert: {
          address_book?: Json | null
          address_validation_status?:
            | Database["public"]["Enums"]["validation_status"]
            | null
          address_verified?: boolean | null
          auth_id?: string | null
          business_classification_id?: string | null
          city?: string | null
          communication_preferences?: Json | null
          company_size?: string | null
          country?: string | null
          created_at?: string
          created_by: string
          customer_since?: string | null
          customer_type?: string
          email?: string | null
          email_validation_status?:
            | Database["public"]["Enums"]["validation_status"]
            | null
          email_verified?: boolean | null
          first_name: string
          id?: string
          language_preference?: string | null
          last_login?: string | null
          last_name: string
          last_visit_date?: string | null
          lifetime_points?: number | null
          lifetime_value?: number | null
          loyalty_join_date?: string | null
          loyalty_points?: number | null
          loyalty_tier?: string | null
          marketing_preferences?: Json | null
          notes?: string | null
          organization_id: string
          phone_number?: string | null
          phone_validation_status?:
            | Database["public"]["Enums"]["validation_status"]
            | null
          phone_verified?: boolean | null
          portal_access_enabled?: boolean | null
          postal_code?: string | null
          preferred_contact_time?: string | null
          secondary_contact?: Json | null
          state_province?: string | null
          status?: string
          street_address?: string | null
          tags?: string[] | null
          timezone?: string | null
          total_spend?: number | null
          updated_at?: string
          updated_by: string
          validation_errors?: Json | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
          visit_count?: number | null
        }
        Update: {
          address_book?: Json | null
          address_validation_status?:
            | Database["public"]["Enums"]["validation_status"]
            | null
          address_verified?: boolean | null
          auth_id?: string | null
          business_classification_id?: string | null
          city?: string | null
          communication_preferences?: Json | null
          company_size?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          customer_since?: string | null
          customer_type?: string
          email?: string | null
          email_validation_status?:
            | Database["public"]["Enums"]["validation_status"]
            | null
          email_verified?: boolean | null
          first_name?: string
          id?: string
          language_preference?: string | null
          last_login?: string | null
          last_name?: string
          last_visit_date?: string | null
          lifetime_points?: number | null
          lifetime_value?: number | null
          loyalty_join_date?: string | null
          loyalty_points?: number | null
          loyalty_tier?: string | null
          marketing_preferences?: Json | null
          notes?: string | null
          organization_id?: string
          phone_number?: string | null
          phone_validation_status?:
            | Database["public"]["Enums"]["validation_status"]
            | null
          phone_verified?: boolean | null
          portal_access_enabled?: boolean | null
          postal_code?: string | null
          preferred_contact_time?: string | null
          secondary_contact?: Json | null
          state_province?: string | null
          status?: string
          street_address?: string | null
          tags?: string[] | null
          timezone?: string | null
          total_spend?: number | null
          updated_at?: string
          updated_by?: string
          validation_errors?: Json | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
          visit_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_business_classification_id_fkey"
            columns: ["business_classification_id"]
            isOneToOne: false
            referencedRelation: "business_classifications"
            referencedColumns: ["id"]
          },
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
      dashboard_configurations: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          organization_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          organization_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          organization_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_configurations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_configurations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_settings: {
        Row: {
          created_at: string
          enabled_stats: string[] | null
          id: string
          layout_config: Json | null
          stats_order: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled_stats?: string[] | null
          id?: string
          layout_config?: Json | null
          stats_order?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled_stats?: string[] | null
          id?: string
          layout_config?: Json | null
          stats_order?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      demo_data: {
        Row: {
          created_at: string | null
          data_type: Database["public"]["Enums"]["demo_data_type"]
          id: string
          organization_id: string
          reference_id: string
        }
        Insert: {
          created_at?: string | null
          data_type: Database["public"]["Enums"]["demo_data_type"]
          id?: string
          organization_id: string
          reference_id: string
        }
        Update: {
          created_at?: string | null
          data_type?: Database["public"]["Enums"]["demo_data_type"]
          id?: string
          organization_id?: string
          reference_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_data_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_template_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_template_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_template_versions: {
        Row: {
          changes_description: string | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          organization_id: string
          subject: string
          template_id: string
          variables: Json | null
          version: number
        }
        Insert: {
          changes_description?: string | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          organization_id: string
          subject: string
          template_id: string
          variables?: Json | null
          version: number
        }
        Update: {
          changes_description?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          organization_id?: string
          subject?: string
          template_id?: string
          variables?: Json | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "email_template_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_template_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          approval_denied_reason: string | null
          approval_level: string | null
          approval_required: boolean
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          archived_by: string | null
          category_id: string | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          is_archived: boolean | null
          is_default: boolean | null
          last_archive_date: string | null
          last_modified_at: string | null
          last_modified_by: string | null
          name: string
          notification_recipients: Json | null
          notification_settings: Json | null
          organization_id: string
          review_requested_at: string | null
          review_requested_by: string | null
          search_tags: string[] | null
          status: string | null
          subject: string
          updated_at: string | null
          updated_by: string | null
          variables: Json | null
          version: number | null
          version_number: number | null
        }
        Insert: {
          approval_denied_reason?: string | null
          approval_level?: string | null
          approval_required?: boolean
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          archived_by?: string | null
          category_id?: string | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          is_archived?: boolean | null
          is_default?: boolean | null
          last_archive_date?: string | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          name: string
          notification_recipients?: Json | null
          notification_settings?: Json | null
          organization_id: string
          review_requested_at?: string | null
          review_requested_by?: string | null
          search_tags?: string[] | null
          status?: string | null
          subject: string
          updated_at?: string | null
          updated_by?: string | null
          variables?: Json | null
          version?: number | null
          version_number?: number | null
        }
        Update: {
          approval_denied_reason?: string | null
          approval_level?: string | null
          approval_required?: boolean
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          archived_by?: string | null
          category_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_archived?: boolean | null
          is_default?: boolean | null
          last_archive_date?: string | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          name?: string
          notification_recipients?: Json | null
          notification_settings?: Json | null
          organization_id?: string
          review_requested_at?: string | null
          review_requested_by?: string | null
          search_tags?: string[] | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          updated_by?: string | null
          variables?: Json | null
          version?: number | null
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_last_modified_by_fkey"
            columns: ["last_modified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_scoring_rules: {
        Row: {
          conditions: Json | null
          cooldown_hours: number | null
          created_at: string | null
          description: string | null
          id: string
          interaction_type: string
          is_active: boolean | null
          name: string
          organization_id: string
          points: number
          updated_at: string | null
        }
        Insert: {
          conditions?: Json | null
          cooldown_hours?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          interaction_type: string
          is_active?: boolean | null
          name: string
          organization_id: string
          points?: number
          updated_at?: string | null
        }
        Update: {
          conditions?: Json | null
          cooldown_hours?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          interaction_type?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          points?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_scoring_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          browser_info: Json | null
          component_name: string | null
          created_at: string | null
          error_message: string
          error_stack: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          route: string | null
          severity: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          component_name?: string | null
          created_at?: string | null
          error_message: string
          error_stack?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          route?: string | null
          severity?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          component_name?: string | null
          created_at?: string | null
          error_message?: string
          error_stack?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          route?: string | null
          severity?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_error_logs_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          status: Database["public"]["Enums"]["integration_status_enum"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id: string
          last_sync_at?: string | null
          organization_id: string
          settings?: Json | null
          status?: Database["public"]["Enums"]["integration_status_enum"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string
          last_sync_at?: string | null
          organization_id?: string
          settings?: Json | null
          status?: Database["public"]["Enums"]["integration_status_enum"] | null
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
      inventory_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          item_id: string
          organization_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          item_id: string
          organization_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          item_id?: string
          organization_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_alerts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_batch_operations: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          error_message: string | null
          id: string
          items: Json
          metadata: Json | null
          operation_type: string
          organization_id: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          error_message?: string | null
          id?: string
          items?: Json
          metadata?: Json | null
          operation_type: string
          organization_id: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          error_message?: string | null
          id?: string
          items?: Json
          metadata?: Json | null
          operation_type?: string
          organization_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batch_operations_organization_id_fkey"
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
          affected_quantity: number | null
          change_category: string | null
          change_type: string
          created_at: string | null
          created_by: string | null
          id: string
          inventory_item_id: string | null
          new_quantity: number | null
          new_value: Json | null
          notes: string | null
          old_value: Json | null
          organization_id: string
          previous_quantity: number | null
          quantity_change: number | null
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          affected_quantity?: number | null
          change_category?: string | null
          change_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id?: string | null
          new_quantity?: number | null
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
          organization_id: string
          previous_quantity?: number | null
          quantity_change?: number | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          affected_quantity?: number | null
          change_category?: string | null
          change_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_item_id?: string | null
          new_quantity?: number | null
          new_value?: Json | null
          notes?: string | null
          old_value?: Json | null
          organization_id?: string
          previous_quantity?: number | null
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
          automotive_category:
            | Database["public"]["Enums"]["automotive_category"]
            | null
          average_turnover_rate: number | null
          barcode: string | null
          category_id: string | null
          condition: string | null
          created_at: string | null
          created_by: string | null
          date_received: string | null
          description: string | null
          dimensions: string | null
          id: string
          image_url: string | null
          last_audit_date: string | null
          last_restock_date: string | null
          lead_time_days: number | null
          location: string | null
          manufacturer: string | null
          markup_percentage: number | null
          minimum_order_quantity: number | null
          name: string
          notes: string | null
          organization_id: string
          preferred_vendor: string | null
          purchase_order_number: string | null
          quantity_in_stock: number | null
          reorder_point: number | null
          reorder_quantity: number | null
          retail_price: number | null
          return_info: string | null
          sales_order_number: string | null
          selling_price: number | null
          sku: string | null
          status: Database["public"]["Enums"]["inventory_item_status"] | null
          subcategory: string | null
          supplier_id: string | null
          unit_cost: number | null
          unit_of_measure: Database["public"]["Enums"]["unit_of_measure"] | null
          unit_quantity: number | null
          upc_ean: string | null
          updated_at: string | null
          updated_by: string | null
          weight: number | null
        }
        Insert: {
          automotive_category?:
            | Database["public"]["Enums"]["automotive_category"]
            | null
          average_turnover_rate?: number | null
          barcode?: string | null
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          date_received?: string | null
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string | null
          last_audit_date?: string | null
          last_restock_date?: string | null
          lead_time_days?: number | null
          location?: string | null
          manufacturer?: string | null
          markup_percentage?: number | null
          minimum_order_quantity?: number | null
          name: string
          notes?: string | null
          organization_id: string
          preferred_vendor?: string | null
          purchase_order_number?: string | null
          quantity_in_stock?: number | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          retail_price?: number | null
          return_info?: string | null
          sales_order_number?: string | null
          selling_price?: number | null
          sku?: string | null
          status?: Database["public"]["Enums"]["inventory_item_status"] | null
          subcategory?: string | null
          supplier_id?: string | null
          unit_cost?: number | null
          unit_of_measure?:
            | Database["public"]["Enums"]["unit_of_measure"]
            | null
          unit_quantity?: number | null
          upc_ean?: string | null
          updated_at?: string | null
          updated_by?: string | null
          weight?: number | null
        }
        Update: {
          automotive_category?:
            | Database["public"]["Enums"]["automotive_category"]
            | null
          average_turnover_rate?: number | null
          barcode?: string | null
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          date_received?: string | null
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string | null
          last_audit_date?: string | null
          last_restock_date?: string | null
          lead_time_days?: number | null
          location?: string | null
          manufacturer?: string | null
          markup_percentage?: number | null
          minimum_order_quantity?: number | null
          name?: string
          notes?: string | null
          organization_id?: string
          preferred_vendor?: string | null
          purchase_order_number?: string | null
          quantity_in_stock?: number | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          retail_price?: number | null
          return_info?: string | null
          sales_order_number?: string | null
          selling_price?: number | null
          sku?: string | null
          status?: Database["public"]["Enums"]["inventory_item_status"] | null
          subcategory?: string | null
          supplier_id?: string | null
          unit_cost?: number | null
          unit_of_measure?:
            | Database["public"]["Enums"]["unit_of_measure"]
            | null
          unit_quantity?: number | null
          upc_ean?: string | null
          updated_at?: string | null
          updated_by?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_items_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
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
      inventory_metrics: {
        Row: {
          calculated_at: string | null
          created_at: string | null
          id: string
          low_stock_items: number | null
          metadata: Json | null
          organization_id: string
          out_of_stock_items: number | null
          total_items: number | null
          total_value: number | null
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string | null
          id?: string
          low_stock_items?: number | null
          metadata?: Json | null
          organization_id: string
          out_of_stock_items?: number | null
          total_items?: number | null
          total_value?: number | null
        }
        Update: {
          calculated_at?: string | null
          created_at?: string | null
          id?: string
          low_stock_items?: number | null
          metadata?: Json | null
          organization_id?: string
          out_of_stock_items?: number | null
          total_items?: number | null
          total_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_notifications: {
        Row: {
          alert_type: string
          created_at: string | null
          current_value: number | null
          id: string
          inventory_item_id: string | null
          message: string
          metadata: Json | null
          organization_id: string
          priority: string | null
          read_at: string | null
          status: string | null
          threshold_value: number | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          inventory_item_id?: string | null
          message: string
          metadata?: Json | null
          organization_id: string
          priority?: string | null
          read_at?: string | null
          status?: string | null
          threshold_value?: number | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          current_value?: number | null
          id?: string
          inventory_item_id?: string | null
          message?: string
          metadata?: Json | null
          organization_id?: string
          priority?: string | null
          read_at?: string | null
          status?: string | null
          threshold_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_notifications_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          estimated_duration_range: Json | null
          estimated_hours: number | null
          id: string
          is_active: boolean | null
          is_archived: boolean | null
          job_number: string | null
          name: string
          organization_id: string | null
          parts_required: Json | null
          required_certifications: Json | null
          required_tools: Json | null
          status: Database["public"]["Enums"]["job_status"] | null
          sub_tasks: Json | null
          timeline: Json | null
          typical_parts: Json | null
          updated_at: string
          updated_by: string | null
          version: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["job_category"]
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration_range?: Json | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          job_number?: string | null
          name: string
          organization_id?: string | null
          parts_required?: Json | null
          required_certifications?: Json | null
          required_tools?: Json | null
          status?: Database["public"]["Enums"]["job_status"] | null
          sub_tasks?: Json | null
          timeline?: Json | null
          typical_parts?: Json | null
          updated_at?: string
          updated_by?: string | null
          version?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["job_category"]
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration_range?: Json | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          is_archived?: boolean | null
          job_number?: string | null
          name?: string
          organization_id?: string | null
          parts_required?: Json | null
          required_certifications?: Json | null
          required_tools?: Json | null
          status?: Database["public"]["Enums"]["job_status"] | null
          sub_tasks?: Json | null
          timeline?: Json | null
          typical_parts?: Json | null
          updated_at?: string
          updated_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
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
      loyalty_program_settings: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          point_settings: Json
          tier_settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          point_settings?: Json
          tier_settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          point_settings?: Json
          tier_settings?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_recipients: {
        Row: {
          created_at: string
          id: string
          notification_types: string[] | null
          organization_id: string
          recipient_id: string
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_types?: string[] | null
          organization_id: string
          recipient_id: string
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_types?: string[] | null
          organization_id?: string
          recipient_id?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_recipients_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
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
          dashboard_preferences: Json | null
          emergency_contact: Json | null
          first_name: string | null
          hire_date: string | null
          id: string
          invitation_sent_at: string | null
          invitation_token: string | null
          last_name: string | null
          notes: string | null
          notification_preferences: Json | null
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
          dashboard_preferences?: Json | null
          emergency_contact?: Json | null
          first_name?: string | null
          hire_date?: string | null
          id: string
          invitation_sent_at?: string | null
          invitation_token?: string | null
          last_name?: string | null
          notes?: string | null
          notification_preferences?: Json | null
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
          dashboard_preferences?: Json | null
          emergency_contact?: Json | null
          first_name?: string | null
          hire_date?: string | null
          id?: string
          invitation_sent_at?: string | null
          invitation_token?: string | null
          last_name?: string | null
          notes?: string | null
          notification_preferences?: Json | null
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
      repair_job_history: {
        Row: {
          change_type: string
          changed_by: string
          created_at: string | null
          id: string
          new_status: string | null
          new_value: Json | null
          notes: string | null
          old_status: string | null
          old_value: Json | null
          organization_id: string
          repair_job_id: string
        }
        Insert: {
          change_type: string
          changed_by: string
          created_at?: string | null
          id?: string
          new_status?: string | null
          new_value?: Json | null
          notes?: string | null
          old_status?: string | null
          old_value?: Json | null
          organization_id: string
          repair_job_id: string
        }
        Update: {
          change_type?: string
          changed_by?: string
          created_at?: string | null
          id?: string
          new_status?: string | null
          new_value?: Json | null
          notes?: string | null
          old_status?: string | null
          old_value?: Json | null
          organization_id?: string
          repair_job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_job_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_job_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_job_labor: {
        Row: {
          actual_duration_minutes: number | null
          created_at: string | null
          efficiency_score: number | null
          end_time: string | null
          error_details: string | null
          estimated_duration_minutes: number | null
          id: string
          is_timer_running: boolean | null
          labor_rate_source: string | null
          labor_rate_type: string | null
          last_timer_update: string | null
          notes: string | null
          organization_id: string
          rate_per_hour: number
          repair_job_id: string
          start_time: string
          status: string | null
          technician_id: string
          timer_started_at: string | null
          updated_at: string | null
        }
        Insert: {
          actual_duration_minutes?: number | null
          created_at?: string | null
          efficiency_score?: number | null
          end_time?: string | null
          error_details?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_timer_running?: boolean | null
          labor_rate_source?: string | null
          labor_rate_type?: string | null
          last_timer_update?: string | null
          notes?: string | null
          organization_id: string
          rate_per_hour: number
          repair_job_id: string
          start_time: string
          status?: string | null
          technician_id: string
          timer_started_at?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_duration_minutes?: number | null
          created_at?: string | null
          efficiency_score?: number | null
          end_time?: string | null
          error_details?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_timer_running?: boolean | null
          labor_rate_source?: string | null
          labor_rate_type?: string | null
          last_timer_update?: string | null
          notes?: string | null
          organization_id?: string
          rate_per_hour?: number
          repair_job_id?: string
          start_time?: string
          status?: string | null
          technician_id?: string
          timer_started_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_job_labor_repair_job_id_fkey"
            columns: ["repair_job_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_job_labor_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_job_parts: {
        Row: {
          cost_per_unit: number | null
          created_at: string | null
          created_by: string | null
          id: string
          organization_id: string
          part_id: string | null
          quantity: number
          repair_job_id: string
          status: string | null
          total_cost: number | null
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          organization_id: string
          part_id?: string | null
          quantity: number
          repair_job_id: string
          status?: string | null
          total_cost?: number | null
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string
          part_id?: string | null
          quantity?: number
          repair_job_id?: string
          status?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_job_parts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_job_parts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_job_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      report_data_sources: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          organization_id: string
          parameters: Json | null
          query_template: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          parameters?: Json | null
          query_template: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          parameters?: Json | null
          query_template?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_data_sources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_data_sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      report_generation_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string
          error_message: string | null
          id: string
          organization_id: string
          output_size: number | null
          output_url: string | null
          parameters: Json | null
          processing_stats: Json | null
          schedule_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["report_processing_status"]
          template_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          error_message?: string | null
          id?: string
          organization_id: string
          output_size?: number | null
          output_url?: string | null
          parameters?: Json | null
          processing_stats?: Json | null
          schedule_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["report_processing_status"]
          template_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          error_message?: string | null
          id?: string
          organization_id?: string
          output_size?: number | null
          output_url?: string | null
          parameters?: Json | null
          processing_stats?: Json | null
          schedule_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["report_processing_status"]
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_generation_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_generation_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_generation_jobs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "report_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_generation_jobs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_outputs: {
        Row: {
          created_at: string
          created_by: string
          file_path: string | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          metadata: Json
          name: string | null
          organization_id: string
          schedule_id: string | null
          sort_options: Json | null
          status: string | null
          template_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          file_path?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          metadata?: Json
          name?: string | null
          organization_id: string
          schedule_id?: string | null
          sort_options?: Json | null
          status?: string | null
          template_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          metadata?: Json
          name?: string | null
          organization_id?: string
          schedule_id?: string | null
          sort_options?: Json | null
          status?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_outputs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_outputs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_outputs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "report_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_outputs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_processing_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          organization_id: string
          schedule_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["report_processing_status"]
          template_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          organization_id: string
          schedule_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["report_processing_status"]
          template_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          organization_id?: string
          schedule_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["report_processing_status"]
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_processing_queue_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_processing_queue_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "report_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_processing_queue_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_schedules: {
        Row: {
          created_at: string
          created_by: string
          frequency: string
          id: string
          last_run: string | null
          name: string | null
          next_run: string | null
          organization_id: string
          recipients: Json
          status: string
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          frequency: string
          id?: string
          last_run?: string | null
          name?: string | null
          next_run?: string | null
          organization_id: string
          recipients?: Json
          status?: string
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          frequency?: string
          id?: string
          last_run?: string | null
          name?: string | null
          next_run?: string | null
          organization_id?: string
          recipients?: Json
          status?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_schedules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_template_layouts: {
        Row: {
          created_at: string | null
          footer_template: string | null
          header_template: string | null
          id: string
          layout_config: Json
          name: string
          organization_id: string
          page_settings: Json | null
          template_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          footer_template?: string | null
          header_template?: string | null
          id?: string
          layout_config?: Json
          name: string
          organization_id: string
          page_settings?: Json | null
          template_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          footer_template?: string | null
          header_template?: string | null
          id?: string
          layout_config?: Json
          name?: string
          organization_id?: string
          page_settings?: Json | null
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_template_layouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_template_layouts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          config: Json
          created_at: string
          created_by: string
          data_source_id: string | null
          description: string | null
          fields: Json
          filters: Json
          generation_settings: Json | null
          id: string
          last_generated_at: string | null
          layout_id: string | null
          name: string
          organization_id: string
          sort_options: Json
          status: string | null
          total_generations: number | null
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by: string
          data_source_id?: string | null
          description?: string | null
          fields?: Json
          filters?: Json
          generation_settings?: Json | null
          id?: string
          last_generated_at?: string | null
          layout_id?: string | null
          name: string
          organization_id: string
          sort_options?: Json
          status?: string | null
          total_generations?: number | null
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string
          data_source_id?: string | null
          description?: string | null
          fields?: Json
          filters?: Json
          generation_settings?: Json | null
          id?: string
          last_generated_at?: string | null
          layout_id?: string | null
          name?: string
          organization_id?: string
          sort_options?: Json
          status?: string | null
          total_generations?: number | null
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_templates_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "report_data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_templates_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "report_template_layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      scheduled_communications: {
        Row: {
          analytics_data: Json | null
          batch_id: string | null
          content: string
          created_at: string | null
          created_by: string
          customer_id: string
          error_message: string | null
          id: string
          last_run_date: string | null
          metadata: Json | null
          next_scheduled_date: string | null
          organization_id: string
          recurrence_pattern: Json | null
          scheduled_for: string
          sent_at: string | null
          status:
            | Database["public"]["Enums"]["scheduled_communication_status"]
            | null
          subject: string | null
          template_id: string | null
          type: string
        }
        Insert: {
          analytics_data?: Json | null
          batch_id?: string | null
          content: string
          created_at?: string | null
          created_by: string
          customer_id: string
          error_message?: string | null
          id?: string
          last_run_date?: string | null
          metadata?: Json | null
          next_scheduled_date?: string | null
          organization_id: string
          recurrence_pattern?: Json | null
          scheduled_for: string
          sent_at?: string | null
          status?:
            | Database["public"]["Enums"]["scheduled_communication_status"]
            | null
          subject?: string | null
          template_id?: string | null
          type: string
        }
        Update: {
          analytics_data?: Json | null
          batch_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          customer_id?: string
          error_message?: string | null
          id?: string
          last_run_date?: string | null
          metadata?: Json | null
          next_scheduled_date?: string | null
          organization_id?: string
          recurrence_pattern?: Json | null
          scheduled_for?: string
          sent_at?: string | null
          status?:
            | Database["public"]["Enums"]["scheduled_communication_status"]
            | null
          subject?: string | null
          template_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_communications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduling_notifications: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string | null
          id: string
          notification_type: string | null
          organization_id: string
          recipient_type: string | null
          repair_job_id: string | null
          resolved_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          notification_type?: string | null
          organization_id: string
          recipient_type?: string | null
          repair_job_id?: string | null
          resolved_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          notification_type?: string | null
          organization_id?: string
          recipient_type?: string | null
          repair_job_id?: string | null
          resolved_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduling_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduling_notifications_repair_job_id_fkey"
            columns: ["repair_job_id"]
            isOneToOne: false
            referencedRelation: "customer_repair_jobs"
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
      sms_messages: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          organization_id: string
          phone_number: string
          sent_at: string | null
          status: Database["public"]["Enums"]["sms_status"] | null
          template_id: string | null
          twilio_message_sid: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          phone_number: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["sms_status"] | null
          template_id?: string | null
          twilio_message_sid?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          phone_number?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["sms_status"] | null
          template_id?: string | null
          twilio_message_sid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "sms_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "sms_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_messages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "sms_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
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
          new_status: string | null
          new_value: string | null
          notes: string | null
          old_status: string | null
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
          new_status?: string | null
          new_value?: string | null
          notes?: string | null
          old_status?: string | null
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
          new_status?: string | null
          new_value?: string | null
          notes?: string | null
          old_status?: string | null
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
      stats: {
        Row: {
          created_at: string | null
          id: string
          trend: number | null
          trend_direction: boolean | null
          type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          trend?: number | null
          trend_direction?: boolean | null
          type: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          trend?: number | null
          trend_direction?: boolean | null
          type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
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
          last_check: string | null
          status: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          last_check?: string | null
          status?: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          last_check?: string | null
          status?: string
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
      template_approval_history: {
        Row: {
          action: string
          approval_level: string | null
          created_at: string
          id: string
          metadata: Json | null
          notes: string | null
          organization_id: string
          performed_by: string
          status: string
          template_id: string
        }
        Insert: {
          action: string
          approval_level?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          organization_id: string
          performed_by: string
          status: string
          template_id: string
        }
        Update: {
          action?: string
          approval_level?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          organization_id?: string
          performed_by?: string
          status?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_approval_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_approval_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_approvers: {
        Row: {
          allowed_approval_levels: string[] | null
          can_approve_all: boolean
          category_ids: string[] | null
          created_at: string
          id: string
          organization_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allowed_approval_levels?: string[] | null
          can_approve_all?: boolean
          category_ids?: string[] | null
          created_at?: string
          id?: string
          organization_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allowed_approval_levels?: string[] | null
          can_approve_all?: boolean
          category_ids?: string[] | null
          created_at?: string
          id?: string
          organization_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_approvers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      template_categories: {
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
            foreignKeyName: "template_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      template_components: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          organization_id: string
          type: Database["public"]["Enums"]["template_component_type"]
          updated_at: string | null
        }
        Insert: {
          category?: string
          content?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          organization_id: string
          type: Database["public"]["Enums"]["template_component_type"]
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          type?: Database["public"]["Enums"]["template_component_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_components_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      template_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          metadata: Json | null
          organization_id: string
          performed_at: string | null
          performed_by: string | null
          template_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          metadata?: Json | null
          organization_id: string
          performed_at?: string | null
          performed_by?: string | null
          template_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          performed_at?: string | null
          performed_by?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_events_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      template_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          id: string
          organization_id: string
          rating: number | null
          technician_id: string | null
          template_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          id?: string
          organization_id: string
          rating?: number | null
          technician_id?: string | null
          template_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string
          rating?: number | null
          technician_id?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_feedback_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "job_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_tag_assignments: {
        Row: {
          created_at: string | null
          id: string
          tag_id: string
          template_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag_id: string
          template_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tag_id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "template_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      template_tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_tags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      template_usage_stats: {
        Row: {
          avg_completion_time: number | null
          id: string
          last_updated: string | null
          organization_id: string
          success_rate: number | null
          template_id: string | null
          use_count: number | null
        }
        Insert: {
          avg_completion_time?: number | null
          id?: string
          last_updated?: string | null
          organization_id: string
          success_rate?: number | null
          template_id?: string | null
          use_count?: number | null
        }
        Update: {
          avg_completion_time?: number | null
          id?: string
          last_updated?: string | null
          organization_id?: string
          success_rate?: number | null
          template_id?: string | null
          use_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_usage_stats_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "job_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_vehicle_compatibility: {
        Row: {
          created_at: string | null
          id: string
          make: string | null
          model: string | null
          organization_id: string
          template_id: string | null
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          make?: string | null
          model?: string | null
          organization_id: string
          template_id?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          make?: string | null
          model?: string | null
          organization_id?: string
          template_id?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_vehicle_compatibility_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "job_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_versions: {
        Row: {
          changes: string | null
          created_at: string | null
          created_by: string | null
          id: string
          organization_id: string
          template_id: string | null
          version_number: number
        }
        Insert: {
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          organization_id: string
          template_id?: string | null
          version_number: number
        }
        Update: {
          changes?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string
          template_id?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "job_templates"
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
      unified_communications: {
        Row: {
          content: string
          created_at: string | null
          customer_id: string
          id: string
          metadata: Json | null
          organization_id: string
          sender_id: string | null
          sent_at: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          customer_id: string
          id?: string
          metadata?: Json | null
          organization_id: string
          sender_id?: string | null
          sent_at?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          sender_id?: string | null
          sent_at?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unified_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "unified_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "unified_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unified_communications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unified_communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_view_state: {
        Row: {
          calendar_view:
            | Database["public"]["Enums"]["calendar_view_type"]
            | null
          created_at: string | null
          id: string
          is_calendar_expanded: boolean | null
          organization_id: string | null
          pagination_settings: Json | null
          search_filters: Json | null
          sort_preferences: Json | null
          state: Json | null
          updated_at: string | null
          user_id: string | null
          view_mode: Database["public"]["Enums"]["dashboard_view_mode"]
          view_type: string
        }
        Insert: {
          calendar_view?:
            | Database["public"]["Enums"]["calendar_view_type"]
            | null
          created_at?: string | null
          id?: string
          is_calendar_expanded?: boolean | null
          organization_id?: string | null
          pagination_settings?: Json | null
          search_filters?: Json | null
          sort_preferences?: Json | null
          state?: Json | null
          updated_at?: string | null
          user_id?: string | null
          view_mode?: Database["public"]["Enums"]["dashboard_view_mode"]
          view_type: string
        }
        Update: {
          calendar_view?:
            | Database["public"]["Enums"]["calendar_view_type"]
            | null
          created_at?: string | null
          id?: string
          is_calendar_expanded?: boolean | null
          organization_id?: string | null
          pagination_settings?: Json | null
          search_filters?: Json | null
          sort_preferences?: Json | null
          state?: Json | null
          updated_at?: string | null
          user_id?: string | null
          view_mode?: Database["public"]["Enums"]["dashboard_view_mode"]
          view_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_view_state_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_methods: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          name: string
          organization_id: string
          validation_type: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
          validation_type: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
          validation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_methods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
            foreignKeyName: "fk_vehicles_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "customer_analytics"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_analytics_dashboard"
            referencedColumns: ["customer_id"]
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
      customer_analytics: {
        Row: {
          average_rating: number | null
          customer_id: string | null
          customer_since: string | null
          email: string | null
          first_name: string | null
          last_feedback_date: string | null
          last_name: string | null
          last_repair_date: string | null
          last_validation_date: string | null
          loyalty_activities: number | null
          loyalty_points: number | null
          organization_id: string | null
          pending_validations: number | null
          tags: string[] | null
          total_documents: number | null
          total_feedback: number | null
          total_repair_jobs: number | null
          total_spend: number | null
          total_validations: number | null
          validation_success_rate: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_analytics_dashboard: {
        Row: {
          churn_risk: number | null
          customer_id: string | null
          customer_since: string | null
          email: string | null
          engagement_score: number | null
          first_name: string | null
          last_name: string | null
          loyalty_points: number | null
          organization_id: string | null
          recent_activities: Json | null
          satisfaction_score: number | null
          total_spend: number | null
        }
        Insert: {
          churn_risk?: never
          customer_id?: string | null
          customer_since?: string | null
          email?: string | null
          engagement_score?: never
          first_name?: string | null
          last_name?: string | null
          loyalty_points?: number | null
          organization_id?: string | null
          recent_activities?: never
          satisfaction_score?: never
          total_spend?: never
        }
        Update: {
          churn_risk?: never
          customer_id?: string | null
          customer_since?: string | null
          email?: string | null
          engagement_score?: never
          first_name?: string | null
          last_name?: string | null
          loyalty_points?: number | null
          organization_id?: string | null
          recent_activities?: never
          satisfaction_score?: never
          total_spend?: never
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_history_view: {
        Row: {
          change_type: string | null
          changed_by: string | null
          changed_by_first_name: string | null
          changed_by_last_name: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          field_name: string | null
          id: string | null
          new_status: string | null
          new_value: string | null
          notes: string | null
          old_status: string | null
          old_value: string | null
          organization_id: string | null
          profile_id: string | null
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
      work_order_messages: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string | null
          id: string | null
          metadata: Json | null
          room_id: string | null
          sender_first_name: string | null
          sender_id: string | null
          sender_last_name: string | null
          updated_at: string | null
        }
        Relationships: [
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
      calculate_customer_engagement_score: {
        Args: {
          customer_id: string
        }
        Returns: number
      }
      calculate_workday_duration: {
        Args: {
          p_organization_id: string
          p_date: string
        }
        Returns: unknown
      }
      can_approve_template: {
        Args: {
          template_id: string
          user_id: string
        }
        Returns: boolean
      }
      cast_validation_status: {
        Args: {
          status: string
        }
        Returns: Json
      }
      check_labor_time_conflicts: {
        Args: {
          p_technician_id: string
          p_start_time: string
          p_end_time: string
          p_current_labor_id?: string
        }
        Returns: boolean
      }
      check_organization_membership: {
        Args: {
          user_id: string
          org_id: string
        }
        Returns: boolean
      }
      check_technician_availability: {
        Args: {
          p_technician_id: string
          p_start_time: string
          p_end_time: string
        }
        Returns: boolean
      }
      cleanup_demo_data: {
        Args: {
          org_id: string
        }
        Returns: undefined
      }
      duplicate_template: {
        Args: {
          template_id: string
          new_name?: string
        }
        Returns: string
      }
      generate_demo_work_orders: {
        Args: {
          org_id: string
          count?: number
        }
        Returns: undefined
      }
      get_next_working_day: {
        Args: {
          p_organization_id: string
          p_start_date: string
        }
        Returns: string
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
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      has_custom_role: {
        Args: {
          user_uuid: string
          org_uuid: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      process_scheduled_communications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_staff_password: {
        Args: {
          staff_id: string
        }
        Returns: undefined
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      app_role:
        | "owner"
        | "management"
        | "service_advisor"
        | "technician"
        | "staff"
      approver_level: "primary" | "secondary" | "final"
      automotive_category:
        | "Electrical"
        | "Brakes"
        | "Suspension"
        | "Fluids"
        | "Steering"
        | "Engine"
        | "Transmission"
        | "Exhaust"
        | "HVAC"
        | "Body"
        | "Lighting"
        | "Filters"
        | "Accessories"
        | "Tools"
        | "Other"
      booking_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      calendar_view_type: "day" | "week" | "month"
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
      communication_status:
        | "draft"
        | "scheduled"
        | "sent"
        | "failed"
        | "cancelled"
      communication_type: "email" | "sms"
      dashboard_view_mode: "calendar" | "grid" | "list"
      demo_data_type: "work_order" | "booking" | "customer" | "vehicle"
      integration_status: "connected" | "not_connected"
      integration_status_enum: "connected" | "not_connected" | "disconnected"
      inventory_change_type:
        | "create"
        | "update"
        | "delete"
        | "stock_adjustment"
        | "work_order"
        | "warranty_claim"
      inventory_item_status: "active" | "inactive" | "needs_attention"
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
      report_data_type:
        | "string"
        | "number"
        | "date"
        | "boolean"
        | "currency"
        | "percentage"
      report_processing_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
      report_type: "tabular" | "summary" | "chart"
      scheduled_communication_status:
        | "pending"
        | "sent"
        | "failed"
        | "cancelled"
      sms_status: "pending" | "sent" | "failed" | "delivered"
      template_component_type: "text" | "html" | "dynamic"
      template_sort_option: "name" | "created_at" | "updated_at" | "last_used"
      time_off_status: "pending" | "approved" | "rejected"
      time_off_type: "vacation" | "sick" | "personal" | "training"
      unit_of_measure:
        | "Each"
        | "Pair"
        | "Set"
        | "Litre"
        | "Gallon"
        | "Quart"
        | "Ounce"
        | "Milliliter"
        | "Gram"
        | "Kilogram"
        | "Pound"
        | "Foot"
        | "Meter"
        | "Inch"
        | "Box"
        | "Case"
        | "Roll"
        | "Sheet"
      user_role:
        | "owner"
        | "management"
        | "technician"
        | "service_advisor"
        | "parts"
        | "hr"
        | "custom"
      validation_status: "pending" | "valid" | "invalid"
    }
    CompositeTypes: {
      notification_preferences_type: {
        email: boolean | null
        sms: boolean | null
        push: boolean | null
      }
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
