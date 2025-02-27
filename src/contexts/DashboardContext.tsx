
import { createContext, useContext, ReactNode, useMemo, useCallback, useRef, useEffect } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";
import { useViewState } from "@/hooks/useViewState";
import { useStats } from "./StatsContext";
import { useAuth } from "./AuthContext";
import { DashboardContextValue, DashboardProfile } from "@/types/dashboard/consolidated";

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

// Stable object for initial view state
const initialViewState = {
  selectedDate: new Date(),
  view: "day" as const,
  viewMode: "calendar" as const,
  isCalendarExpanded: false,
};

export function DashboardContextProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { viewState, updateViewState } = useViewState("dashboard");
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useBookings();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(user?.id);
  const { stats, isLoading: statsLoading, error: statsError } = useStats();

  // Use ref for previous viewState to optimize updates
  const prevViewStateRef = useRef(viewState);

  // Effect to update ref
  useEffect(() => {
    prevViewStateRef.current = viewState;
  }, [viewState]);

  // Memoize dashboard profile transformation with stable defaults
  const dashboardProfile: DashboardProfile | null = useMemo(() => {
    if (!profile) return null;
    const defaultColors = {
      primary_color: "#0EA5E9",
      secondary_color: "#EFF6FF",
      border_color: "#0EA5E9",
      background_color: "bg-background/95"
    };

    return {
      id: profile.id,
      organization_id: profile.organization_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.role,
      color_preferences: profile.color_preferences 
        ? {
            primary_color: String((profile.color_preferences as Record<string, unknown>)?.primary_color || defaultColors.primary_color),
            secondary_color: String((profile.color_preferences as Record<string, unknown>)?.secondary_color || defaultColors.secondary_color),
            border_color: String((profile.color_preferences as Record<string, unknown>)?.border_color || defaultColors.border_color),
            background_color: String((profile.color_preferences as Record<string, unknown>)?.background_color || defaultColors.background_color)
          }
        : null
    };
  }, [profile]);

  // Optimized action callbacks with stable references
  const setView = useCallback((view: "day" | "week" | "month") => {
    updateViewState(prev => ({
      ...prev,
      state: { ...prev?.state, defaultView: view }
    }));
  }, [updateViewState]);

  const setViewMode = useCallback((mode: "calendar" | "grid" | "list") => {
    updateViewState(prev => ({
      ...prev,
      view_mode: mode
    }));
  }, [updateViewState]);

  const setSelectedDate = useCallback((date: Date) => {
    updateViewState(prev => ({
      ...prev,
      state: { ...prev?.state, selectedDate: date }
    }));
  }, [updateViewState]);

  const setIsCalendarExpanded = useCallback((expanded: boolean) => {
    updateViewState(prev => ({
      ...prev,
      is_calendar_expanded: expanded
    }));
  }, [updateViewState]);

  // Memoized actions with stable references
  const actions = useMemo(() => ({
    setView,
    setViewMode,
    setSelectedDate,
    setIsCalendarExpanded,
  }), [setView, setViewMode, setSelectedDate, setIsCalendarExpanded]);

  // Memoized bookings transformation
  const processedBookings = useMemo(() => 
    bookings?.map(booking => ({
      ...booking,
      notification_preferences: {
        ...booking.notification_preferences,
        push: false
      }
    })) || [],
    [bookings]
  );

  // Memoized state with optimized dependency tracking
  const state = useMemo(() => ({
    view: {
      selectedDate: viewState?.state?.selectedDate || initialViewState.selectedDate,
      view: viewState?.state?.defaultView || initialViewState.view,
      viewMode: viewState?.view_mode || initialViewState.viewMode,
      isCalendarExpanded: viewState?.is_calendar_expanded || initialViewState.isCalendarExpanded,
    },
    data: {
      bookings: processedBookings,
      stats: stats || [],
      profile: dashboardProfile,
    },
    loading: {
      bookings: bookingsLoading,
      stats: statsLoading,
      profile: profileLoading,
    },
    errors: {
      bookings: bookingsError,
      stats: statsError,
      profile: profileError,
    },
  }), [
    viewState?.state?.selectedDate,
    viewState?.state?.defaultView,
    viewState?.view_mode,
    viewState?.is_calendar_expanded,
    processedBookings,
    stats,
    dashboardProfile,
    bookingsLoading,
    statsLoading,
    profileLoading,
    bookingsError,
    statsError,
    profileError,
  ]);

  return (
    <DashboardContext.Provider value={{ state, actions }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardContextProvider");
  }
  return context;
}
