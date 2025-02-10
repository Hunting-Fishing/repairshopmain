
import { createContext, useContext, useState, ReactNode } from "react";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { useUserProfile } from "./hooks/useUserProfile";

interface DashboardContextType {
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

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [viewMode, setViewMode] = useState<"calendar" | "grid" | "list">("calendar");
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const { data: bookings, isLoading: isBookingsLoading, error: bookingsError } = useCalendarBookings(selectedDate);
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();

  const value = {
    selectedDate,
    setSelectedDate,
    view,
    setView,
    viewMode,
    setViewMode,
    isCalendarExpanded,
    setIsCalendarExpanded,
    bookings: bookings || [],
    isBookingsLoading,
    bookingsError,
    userProfile,
    isProfileLoading,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
