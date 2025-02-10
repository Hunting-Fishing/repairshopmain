
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";
import { useViewState } from "@/hooks/useViewState";
import { useStats } from "./StatsContext";
import { useAuth } from "./AuthContext";
import { DashboardContextValue } from "@/types/dashboard/consolidated";
import { toast } from "sonner";

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardContextProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { viewState, updateViewState } = useViewState("dashboard");
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useBookings();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(user?.id);
  const { stats, isLoading: statsLoading, error: statsError } = useStats();

  const state = useMemo(() => ({
    view: {
      selectedDate: new Date(),
      view: viewState?.state?.defaultView || "day",
      viewMode: viewState?.view_mode || "calendar",
      isCalendarExpanded: viewState?.is_calendar_expanded || false,
    },
    data: {
      bookings: bookings || [],
      stats: stats || [],
      profile,
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
    profile, profileLoading, profileError,
    viewState
  ]);

  const actions = useMemo(() => ({
    setView: (view: "day" | "week" | "month") => {
      updateViewState({
        ...viewState,
        state: { ...viewState?.state, defaultView: view }
      });
    },
    setViewMode: (mode: "calendar" | "grid" | "list") => {
      updateViewState({
        ...viewState,
        view_mode: mode
      });
    },
    setSelectedDate: (date: Date) => {
      updateViewState({
        ...viewState,
        state: { ...viewState?.state, selectedDate: date }
      });
    },
    setIsCalendarExpanded: (expanded: boolean) => {
      updateViewState({
        ...viewState,
        is_calendar_expanded: expanded
      });
    },
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
