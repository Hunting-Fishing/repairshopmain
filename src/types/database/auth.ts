export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 
  | "owner"
  | "management"
  | "technician"
  | "service_advisor"
  | "parts"
  | "hr"
  | "custom"

export type BookingStatus = "scheduled" | "in_progress" | "completed" | "cancelled"