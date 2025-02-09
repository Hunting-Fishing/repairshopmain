
import { useStatsQuery } from "./hooks/useStatsQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./components/StatCard";
import { useStatsIcons } from "./hooks/useStatsIcons";

interface StatsCardsProps {
  isModernTheme?: boolean;
}

const formatTitle = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function StatsCards({ isModernTheme = false }: StatsCardsProps) {
  const { data: stats, isLoading, error } = useStatsQuery();
  const statIcons = useStatsIcons();
  
  const { data: settings } = useQuery({
    queryKey: ['dashboard-stats-config'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('dashboard_settings')
        .select('stats_order, enabled_stats')
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
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const enabledStats = settings?.enabled_stats || [
    'total_work_orders', 
    'active_customers', 
    'pending_jobs', 
    'average_service_time', 
    'customer_satisfaction'
  ];

  const uniqueStats = stats?.filter(stat => enabledStats.includes(stat.type))
    .reduce((acc, current) => {
      const x = acc.find(item => item.type === current.type);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as typeof stats extends (infer U)[] ? U[] : never) || [];

  const sortedStats = [...uniqueStats].sort((a, b) => {
    const aOrder = settings?.stats_order?.find(item => item.id === a.type)?.order || 0;
    const bOrder = settings?.stats_order?.find(item => item.id === b.type)?.order || 0;
    return aOrder - bOrder;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {sortedStats.map((stat, index) => {
        const Icon = statIcons[stat.type];
        
        return (
          <StatCard
            key={stat.type}
            title={formatTitle(stat.type)}
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
  );
}
