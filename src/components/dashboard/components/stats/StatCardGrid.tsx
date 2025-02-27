
import { useStats } from "@/contexts/StatsContext";
import { StatCard } from "../StatCard";
import { useStatsIcons } from "../../hooks/useStatsIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatStatTitle } from "../../utils/statsFormatters";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { toast } from "sonner";
import { memo, useCallback, useMemo } from "react";
import { StatData } from "../../hooks/useStatsQuery";

interface StatCardGridProps {
  isModernTheme?: boolean;
}

// Define preferred order of stats
const PREFERRED_STAT_ORDER = [
  'total_work_orders',
  'active_customers',
  'pending_jobs',
  'average_service_time',
  'customer_satisfaction',
  // Add any other stats in preferred order
];

// Memoize each individual card to prevent unnecessary re-renders
const MemoizedStatCard = memo(function MemoizedStatCard({
  stat,
  icon,
  isModernTheme,
  index
}: {
  stat: StatData;
  icon: React.ElementType;
  isModernTheme: boolean;
  index: number;
}) {
  return (
    <StatCard
      key={`${stat.type}-${stat.id}`}
      title={formatStatTitle(stat.type)}
      value={stat.value}
      type={stat.type}
      trend={stat.trend}
      trendDirection={stat.trend_direction}
      icon={icon}
      isModernTheme={isModernTheme}
      index={index}
    />
  );
});

export function StatCardGrid({ isModernTheme = false }: StatCardGridProps) {
  const { uniqueStats, isLoading, error } = useStats();
  const statIcons = useStatsIcons();

  const handleStatsError = useCallback((error: Error) => {
    console.error("Stats error:", error);
    toast.error("Failed to load statistics");
  }, []);

  // Order stats according to preferred order
  const orderedStats = useMemo(() => {
    if (!uniqueStats?.length) return [];
    
    // Create a map for O(1) lookups
    const statsMap = new Map(uniqueStats.map(stat => [stat.type, stat]));
    
    // First, add stats in the preferred order if they exist
    const result: StatData[] = [];
    
    PREFERRED_STAT_ORDER.forEach(type => {
      const stat = statsMap.get(type);
      if (stat) {
        result.push(stat);
        statsMap.delete(type);
      }
    });
    
    // Then add any remaining stats
    statsMap.forEach(stat => result.push(stat));
    
    return result;
  }, [uniqueStats]);

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
        {orderedStats.map((stat, index) => {
          const Icon = statIcons[stat.type] || statIcons.default;
          return (
            <MemoizedStatCard 
              key={stat.id}
              stat={stat}
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
