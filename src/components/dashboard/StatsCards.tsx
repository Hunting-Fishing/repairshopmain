import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  Users, 
  Wrench,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useStatsQuery } from "./hooks/useStatsQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface StatsCardsProps {
  isModernTheme?: boolean;
}

const statIcons = {
  total_work_orders: ClipboardList,
  active_customers: Users,
  pending_jobs: Wrench,
  average_service_time: Clock,
  customer_satisfaction: Star,
} as const;

const formatValue = (type: string, value: number): string => {
  switch (type) {
    case 'average_service_time':
      return `${value} hrs`;
    case 'customer_satisfaction':
      return `${value}/5`;
    default:
      return value.toString();
  }
};

const formatTitle = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function StatsCards({ isModernTheme = false }: StatsCardsProps) {
  const { data: stats, isLoading, error } = useStatsQuery();
  const { data: settings } = useQuery({
    queryKey: ['dashboard-stats-config'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('dashboard_settings')
        .select('stats_order')
        .eq('user_id', user.id)
        .maybeSingle();

      return data;
    }
  });

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50 dark:bg-red-900/10">
        Failed to load statistics. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const sortedStats = stats?.sort((a, b) => {
    const aOrder = settings?.stats_order?.find(item => item.id === a.type)?.order || 0;
    const bOrder = settings?.stats_order?.find(item => item.id === b.type)?.order || 0;
    return aOrder - bOrder;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {sortedStats?.map((stat, index) => {
        const Icon = statIcons[stat.type as keyof typeof statIcons];
        
        return (
          <Card 
            key={stat.type} 
            className={cn(
              "relative overflow-hidden transition-all duration-300 hover:scale-105 group",
              isModernTheme 
                ? "bg-gradient-to-br from-white via-white to-[#F8F9FF] dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800/80 shadow-lg hover:shadow-xl border border-[#E2E8F0]/50 dark:border-blue-900/50"
                : "bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:from-blue-600/90 dark:to-blue-700/90 text-white"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  isModernTheme 
                    ? "text-gray-600 dark:text-gray-300" 
                    : "text-white/90"
                )}>
                  Card {index + 1} - {formatTitle(stat.type)}
                </CardTitle>
                {Icon && (
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isModernTheme 
                      ? "text-blue-500 dark:text-blue-400" 
                      : "text-white/90"
                  )} />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold mb-1",
                isModernTheme 
                  ? "bg-gradient-to-br from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                  : "text-white"
              )}>
                {formatValue(stat.type, stat.value)}
              </div>
              <div className="flex items-center text-xs">
                {stat.trend_direction ? (
                  <TrendingUp className={cn(
                    "h-3 w-3 mr-1",
                    isModernTheme 
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-white/90"
                  )} />
                ) : (
                  <TrendingDown className={cn(
                    "h-3 w-3 mr-1",
                    isModernTheme 
                      ? "text-red-500 dark:text-red-400"
                      : "text-white/90"
                  )} />
                )}
                <span className={cn(
                  stat.trend_direction 
                    ? "text-emerald-500 dark:text-emerald-400" 
                    : "text-red-500 dark:text-red-400"
                )}>
                  {stat.trend_direction ? '+' : ''}{stat.trend}%
                </span>
                <span className={cn(
                  "ml-1",
                  isModernTheme 
                    ? "text-gray-500 dark:text-gray-400" 
                    : "text-white/75"
                )}>
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
