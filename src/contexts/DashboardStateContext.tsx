
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";
import { useViewState } from "@/hooks/useViewState";
import { useStats } from "./StatsContext";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface DashboardState {
  view: {
    selectedDate: Date;
    view: "day" | "week" | "month";
    viewMode: "calendar" | "grid" | "list";
    isCalendarExpanded: boolean;
  };
  data: {
    bookings: any[];
    stats: any[];
    profile: any;
  };
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

const DashboardStateContext = createContext<{
  state: DashboardState;
  actions: {
    setView: (view: "day" | "week" | "month") => void;
    setViewMode: (mode: "calendar" | "grid" | "list") => void;
    setSelectedDate: (date: Date) => void;
    setIsCalendarExpanded: (expanded: boolean) => void;
  };
} | undefined>(undefined);

export function DashboardStateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { viewState, updateViewState } = useViewState("dashboard");
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useBookings();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(user?.id);
  const { stats, isLoading: statsLoading, error: statsError } = useStats();

  const state: DashboardState = useMemo(() => ({
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
    <DashboardStateContext.Provider value={{ state, actions }}>
      {children}
    </DashboardStateContext.Provider>
  );
}

export function useDashboardState() {
  const context = useContext(DashboardStateContext);
  if (context === undefined) {
    throw new Error("useDashboardState must be used within a DashboardStateProvider");
  }
  return context;
}
