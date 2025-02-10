
import { ViewState } from "../dashboard";

export interface DashboardState {
  selectedDate: Date;
  view: "day" | "week" | "month";
  viewMode: "calendar" | "grid" | "list";
  isCalendarExpanded: boolean;
}

export interface DashboardContextType extends ViewState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  view: "day" | "week" | "month";
  setView: (view: "day" | "week" | "month") => void;
  viewMode: "calendar" | "grid" | "list";
  setViewMode: (mode: "calendar" | "grid" | "list") => void;
  isCalendarExpanded: boolean;
  setIsCalendarExpanded: (expanded: boolean) => void;
  bookings: any[];
  isBookingsLoading: boolean;
  bookingsError: Error | null;
  userProfile: any;
  isProfileLoading: boolean;
}
