
import { useAppState } from "@/contexts/AppStateContext";
import { StatCard } from "./StatCard";
import { useStatsIcons } from "../../hooks/useStatsIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatStatTitle } from "../../utils/statsFormatters";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { toast } from "sonner";

interface StatCardGridProps {
  isModernTheme?: boolean;
}

export function StatCardGrid({ isModernTheme = false }: StatCardGridProps) {
  const { stats: { stats, isLoading, error } } = useAppState();
  const statIcons = useStatsIcons();

  const handleStatsError = (error: Error) => {
    console.error("Stats error:", error);
    toast.error("Failed to load statistics");
  };

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

  const uniqueStats = stats?.reduce((acc, current) => {
    const x = acc.find(item => item.type === current.type);
    if (!x) {
      return acc.concat([current]);
    }
    return acc;
  }, [] as typeof stats extends (infer U)[] ? U[] : never) || [];

  return (
    <ErrorBoundary
      onError={handleStatsError}
      fallback={
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            An error occurred while displaying statistics. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {uniqueStats.map((stat, index) => {
          const Icon = statIcons[stat.type];
          return (
            <StatCard
              key={stat.type}
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
