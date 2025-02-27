
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useStatsQuery, StatData } from "@/components/dashboard/hooks/useStatsQuery";

interface StatsContextType {
  stats: StatData[] | undefined;
  isLoading: boolean;
  error: Error | null;
  // Add more derived data properties
  uniqueStats: StatData[];
  latestStatsByType: Record<string, StatData>;
  hasStats: boolean;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const { data: stats, isLoading, error } = useStatsQuery();

  // Memoize derived stats data to prevent recalculations
  const derivedStats = useMemo(() => {
    if (!stats || stats.length === 0) {
      return {
        uniqueStats: [],
        latestStatsByType: {},
        hasStats: false
      };
    }

    // Get latest stats by type
    const statsByType: Record<string, StatData> = {};
    
    stats.forEach(stat => {
      if (!statsByType[stat.type] || 
          new Date(stat.created_at) > new Date(statsByType[stat.type].created_at)) {
        statsByType[stat.type] = stat;
      }
    });

    // Create ordered unique stats array
    const uniqueStatsArray = Object.values(statsByType);
    
    return {
      uniqueStats: uniqueStatsArray,
      latestStatsByType: statsByType,
      hasStats: uniqueStatsArray.length > 0
    };
  }, [stats]);

  const value = useMemo(() => ({
    stats,
    isLoading,
    error,
    ...derivedStats
  }), [stats, isLoading, error, derivedStats]);

  return (
    <StatsContext.Provider value={value}>
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
