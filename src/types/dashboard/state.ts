
import { ViewState } from "../dashboard";

export interface DashboardState extends ViewState {
  selectedDate: Date;
  view: "day" | "week" | "month";
  viewMode: "calendar" | "grid" | "list";
  isCalendarExpanded: boolean;
}

export interface DashboardContextType extends DashboardState {
  setSelectedDate: (date: Date) => void;
  setView: (view: "day" | "week" | "month") => void;
  setViewMode: (mode: "calendar" | "grid" | "list") => void;
  setIsCalendarExpanded: (expanded: boolean) => void;
  bookings: any[];
  isBookingsLoading: boolean;
  bookingsError: Error | null;
  userProfile: any;
  isProfileLoading: boolean;
}
