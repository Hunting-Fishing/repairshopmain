
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useTheme } from "./ThemeContext";
import { useStats } from "./StatsContext";
import { useDashboard } from "@/components/dashboard/DashboardProvider";

interface AppStateContextType {
  theme: {
    isModernTheme: boolean;
    toggleTheme: (checked: boolean) => Promise<void>;
  };
  stats: {
    stats: any[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  dashboard: {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    view: "day" | "week" | "month";
    setView: (view: "day" | "week" | "month") => void;
    viewMode: "calendar" | "grid" | "list";
    setViewMode: (mode: "calendar" | "grid" | "list") => void;
    isCalendarExpanded: boolean;
    setIsCalendarExpanded: (expanded: boolean) => void;
  };
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { isModernTheme, toggleTheme } = useTheme();
  const { stats, isLoading: statsLoading, error: statsError } = useStats();
  const dashboardContext = useDashboard();

  const {
    selectedDate,
    setSelectedDate,
    view,
    setView,
    viewMode,
    setViewMode,
    isCalendarExpanded,
    setIsCalendarExpanded,
  } = dashboardContext;

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    theme: {
      isModernTheme,
      toggleTheme,
    },
    stats: {
      stats,
      isLoading: statsLoading,
      error: statsError,
    },
    dashboard: {
      selectedDate,
      setSelectedDate,
      view,
      setView,
      viewMode,
      setViewMode,
      isCalendarExpanded,
      setIsCalendarExpanded,
    },
  }), [
    isModernTheme, 
    toggleTheme, 
    stats, 
    statsLoading, 
    statsError,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    viewMode,
    setViewMode,
    isCalendarExpanded,
    setIsCalendarExpanded,
  ]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
