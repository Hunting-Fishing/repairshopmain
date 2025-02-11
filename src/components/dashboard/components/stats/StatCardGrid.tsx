
import { useStats } from "@/contexts/StatsContext";
import { StatCard } from "../StatCard";
import { useStatsIcons } from "../../hooks/useStatsIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatStatTitle } from "../../utils/statsFormatters";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { toast } from "sonner";
import { useMemo, useCallback } from "react";

interface StatCardGridProps {
  isModernTheme?: boolean;
}

export function StatCardGrid({ isModernTheme = false }: StatCardGridProps) {
  const { stats, isLoading, error } = useStats();
  const statIcons = useStatsIcons();

  const handleStatsError = useCallback((error: Error) => {
    console.error("Stats error:", error);
    toast.error("Failed to load statistics");
  }, []);

  const uniqueStats = useMemo(() => {
    if (!stats) return [];
    
    // Define the order of stats we want to display
    const statOrder = [
      'total_work_orders',
      'active_customers',
      'pending_jobs',
      'average_service_time',
      'customer_satisfaction'
    ];
    
    // Create a map of the most recent stat for each type
    const statsMap = new Map();
    stats.forEach(stat => {
      if (!statsMap.has(stat.type) || 
          new Date(stat.created_at) > new Date(statsMap.get(stat.type).created_at)) {
        statsMap.set(stat.type, stat);
      }
    });
    
    // Return stats in the specified order
    return statOrder
      .map(type => statsMap.get(type))
      .filter(Boolean); // Remove any undefined entries
  }, [stats]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load statistics: {error.message}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary onError={handleStatsError}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {uniqueStats.map((stat, index) => {
          const Icon = statIcons[stat.type];
          return (
            <StatCard
              key={`${stat.type}-${stat.created_at}`}
              title={formatStatTitle(stat.type)}
              value={stat.value}
              type={stat.type}
              trend={stat.trend}
              trendDirection={stat.trend_direction}
              icon={Icon}
              isModernTheme={isModernTheme}
              index={index}
            />
          );
        })}
      </div>
    </ErrorBoundary>
  );
}
