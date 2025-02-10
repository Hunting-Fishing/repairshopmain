
import { createContext, useContext, ReactNode, useMemo, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { useStats } from "./StatsContext";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface PersistedState {
  lastView?: "day" | "week" | "month";
  lastViewMode?: "calendar" | "grid" | "list";
  isCalendarExpanded?: boolean;
}

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

  // Load persisted state
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) {
          console.log('No user ID available, skipping state load');
          return;
        }

        const { data, error } = await supabase
          .from('user_view_state')
          .select('state')
          .eq('user_id', userId)
          .eq('view_type', 'dashboard')
          .maybeSingle();

        if (error) {
          console.error('Error loading persisted state:', error);
          return;
        }

        if (data?.state) {
          const state = data.state as PersistedState;
          if (state.lastView) setView(state.lastView);
          if (state.lastViewMode) setViewMode(state.lastViewMode);
          if (typeof state.isCalendarExpanded === 'boolean') {
            setIsCalendarExpanded(state.isCalendarExpanded);
          }
        }
      } catch (error) {
        console.error('Error loading persisted state:', error);
      }
    };

    loadPersistedState();
  }, [setView, setViewMode, setIsCalendarExpanded]);

  // Persist state changes
  useEffect(() => {
    const persistState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) {
          console.log('No user ID available, skipping state persistence');
          return;
        }

        const state: PersistedState = {
          lastView: view,
          lastViewMode: viewMode,
          isCalendarExpanded,
        };

        const { error } = await supabase
          .from('user_view_state')
          .upsert({
            user_id: userId,
            view_type: 'dashboard',
            state,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,view_type'
          });

        if (error) {
          console.error('Error persisting state:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error persisting state:', error);
        toast.error('Failed to save view preferences');
      }
    };

    // Debounce the persistState call to avoid too frequent updates
    const timeoutId = setTimeout(persistState, 1000);
    return () => clearTimeout(timeoutId);
  }, [view, viewMode, isCalendarExpanded]);

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

  if (process.env.NODE_ENV === 'development') {
    // Debug logging for state changes
    useEffect(() => {
      console.group('AppState Update');
      console.log('Theme:', isModernTheme);
      console.log('View:', view);
      console.log('ViewMode:', viewMode);
      console.log('IsCalendarExpanded:', isCalendarExpanded);
      console.groupEnd();
    }, [isModernTheme, view, viewMode, isCalendarExpanded]);
  }

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
