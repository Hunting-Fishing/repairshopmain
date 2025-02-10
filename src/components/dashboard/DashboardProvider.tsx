
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { useUserProfile } from "./hooks/useUserProfile";
import { useViewState } from "@/hooks/useViewState";
import { DashboardContextType } from "@/types/dashboard/state";
import { toast } from "sonner";

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  // Initialize with default values
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Use the consolidated view state from database
  const { viewState, updateViewState, isLoading: isViewStateLoading } = useViewState('dashboard');
  
  const [view, setView] = useState<"day" | "week" | "month">(
    viewState?.state?.defaultView || "day"
  );
  
  const [viewMode, setViewMode] = useState<"calendar" | "grid" | "list">(
    viewState?.view_mode || "calendar"
  );
  
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(
    viewState?.is_calendar_expanded || false
  );

  // Fetch bookings and user profile
  const { 
    data: bookings, 
    isLoading: isBookingsLoading, 
    error: bookingsError 
  } = useCalendarBookings(selectedDate);
  
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();

  // Sync state changes with database
  useEffect(() => {
    if (!isViewStateLoading) {
      updateViewState({
        view_type: 'dashboard',
        state: {
          ...viewState?.state,
          defaultView: view,
        },
        view_mode: viewMode,
        is_calendar_expanded: isCalendarExpanded,
        search_filters: viewState?.search_filters || {},
        sort_preferences: viewState?.sort_preferences || {
          field: 'date',
          direction: 'asc'
        },
        pagination_settings: viewState?.pagination_settings || {
          itemsPerPage: 10,
          currentPage: 1
        }
      });
    }
  }, [view, viewMode, isCalendarExpanded]);

  // Handle any booking errors
  useEffect(() => {
    if (bookingsError) {
      toast.error("Failed to load bookings");
      console.error("Booking error:", bookingsError);
    }
  }, [bookingsError]);

  const value: DashboardContextType = {
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
    view_type: 'dashboard',
    state: {
      defaultView: view,
      ...viewState?.state
    },
    search_filters: viewState?.search_filters || {},
    sort_preferences: viewState?.sort_preferences || {
      field: 'date',
      direction: 'asc'
    },
    pagination_settings: viewState?.pagination_settings || {
      itemsPerPage: 10,
      currentPage: 1
    },
    view_mode: viewMode
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
