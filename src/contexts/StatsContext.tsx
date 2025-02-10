
import { createContext, useContext, ReactNode } from "react";
import { useStatsQuery, StatData } from "@/components/dashboard/hooks/useStatsQuery";

interface StatsContextType {
  stats: StatData[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const { data: stats, isLoading, error } = useStatsQuery();

  return (
    <StatsContext.Provider value={{ stats, isLoading, error }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
}
