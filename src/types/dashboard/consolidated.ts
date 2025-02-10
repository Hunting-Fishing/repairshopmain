
import { StatData } from "@/components/dashboard/hooks/useStatsQuery";
import { BookingStatus } from "./database/enums";

export interface DashboardViewState {
  selectedDate: Date;
  view: "day" | "week" | "month";
  viewMode: "calendar" | "grid" | "list";
  isCalendarExpanded: boolean;
}

export interface DashboardData {
  bookings: DashboardBooking[];
  stats: StatData[];
  profile: DashboardProfile | null;
}

export interface DashboardBooking {
  id: string;
  organization_id: string;
  customer_name: string;
  vehicle_info: string;
  job_description: string;
  assigned_technician_id: string | null;
  start_time: string;
  end_time: string;
  status: BookingStatus | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  phone_number: string | null;
  email: string | null;
  notes: string | null;
  duration_minutes: number;
  color: string | null;
  estimated_cost: number | null;
  priority: string;
  source: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
  };
  technician?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface DashboardProfile {
  id: string;
  organization_id: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  color_preferences: {
    primary_color: string;
    secondary_color: string;
    border_color: string;
    background_color: string;
  } | null;
}

export interface DashboardContextState {
  view: DashboardViewState;
  data: DashboardData;
  loading: {
    bookings: boolean;
    stats: boolean;
    profile: boolean;
  };
  errors: {
    bookings: Error | null;
    stats: Error | null;
    profile: Error | null;
  };
}

export interface DashboardContextActions {
  setView: (view: "day" | "week" | "month") => void;
  setViewMode: (mode: "calendar" | "grid" | "list") => void;
  setSelectedDate: (date: Date) => void;
  setIsCalendarExpanded: (expanded: boolean) => void;
}

export interface DashboardContextValue {
  state: DashboardContextState;
  actions: DashboardContextActions;
}
