
import { createContext, useContext, ReactNode, useMemo, useCallback } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";
import { useViewState } from "@/hooks/useViewState";
import { useStats } from "./StatsContext";
import { useAuth } from "./AuthContext";
import { DashboardContextValue, DashboardProfile } from "@/types/dashboard/consolidated";
import { toast } from "sonner";

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardContextProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { viewState, updateViewState } = useViewState("dashboard");
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useBookings();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(user?.id);
  const { stats, isLoading: statsLoading, error: statsError } = useStats();

  // Memoize dashboard profile transformation
  const dashboardProfile: DashboardProfile | null = useMemo(() => {
    if (!profile) return null;
    return {
      id: profile.id,
      organization_id: profile.organization_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      role: profile.role,
      color_preferences: profile.color_preferences ? {
        primary_color: String((profile.color_preferences as Record<string, unknown>)?.primary_color || "#0EA5E9"),
        secondary_color: String((profile.color_preferences as Record<string, unknown>)?.secondary_color || "#EFF6FF"),
        border_color: String((profile.color_preferences as Record<string, unknown>)?.border_color || "#0EA5E9"),
        background_color: String((profile.color_preferences as Record<string, unknown>)?.background_color || "bg-background/95")
      } : null
    };
  }, [profile]);

  // Memoize state object
  const state = useMemo(() => ({
    view: {
      selectedDate: new Date(),
      view: viewState?.state?.defaultView || "day",
      viewMode: viewState?.view_mode || "calendar",
      isCalendarExpanded: viewState?.is_calendar_expanded || false,
    },
    data: {
      bookings: bookings?.map(booking => ({
        ...booking,
        notification_preferences: {
          ...booking.notification_preferences,
          push: false
        }
      })) || [],
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
    bookings, bookingsLoading, bookingsError,
    stats, statsLoading, statsError,
    dashboardProfile, profileLoading, profileError,
    viewState
  ]);

  // Memoize actions
  const actions = useMemo(() => ({
    setView: useCallback((view: "day" | "week" | "month") => {
      updateViewState({
        ...viewState,
        state: { ...viewState?.state, defaultView: view }
      });
    }, [viewState, updateViewState]),

    setViewMode: useCallback((mode: "calendar" | "grid" | "list") => {
      updateViewState({
        ...viewState,
        view_mode: mode
      });
    }, [viewState, updateViewState]),

    setSelectedDate: useCallback((date: Date) => {
      updateViewState({
        ...viewState,
        state: { ...viewState?.state, selectedDate: date }
      });
    }, [viewState, updateViewState]),

    setIsCalendarExpanded: useCallback((expanded: boolean) => {
      updateViewState({
        ...viewState,
        is_calendar_expanded: expanded
      });
    }, [viewState, updateViewState]),
  }), [viewState, updateViewState]);

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
