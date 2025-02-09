
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

  if (error) {
    console.error('Error fetching stats:', error);
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50">
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
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stats?.map((stat) => {
        const Icon = statIcons[stat.type as keyof typeof statIcons];
        
        return (
          <Card 
            key={stat.type} 
            className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
              isModernTheme 
                ? 'bg-white/80 backdrop-blur-lg border border-blue-100/50 shadow-lg hover:shadow-xl'
                : `bg-gradient-to-br from-${stat.type === 'total_work_orders' ? 'blue-500 to-purple-600' : 
                    stat.type === 'active_customers' ? 'green-500 to-teal-600' :
                    stat.type === 'pending_jobs' ? 'amber-500 to-orange-600' :
                    stat.type === 'average_service_time' ? 'pink-500 to-rose-600' :
                    'violet-500 to-purple-600'} text-white`
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className={`text-sm font-medium ${
                  isModernTheme ? 'text-gray-700' : 'text-white/90'
                }`}>
                  {formatTitle(stat.type)}
                </CardTitle>
                {Icon && (
                  <Icon className={`h-5 w-5 ${
                    isModernTheme ? 'text-blue-500' : 'text-white/90'
                  }`} />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-1 ${
                isModernTheme 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent'
                  : 'text-white'
              }`}>
                {formatValue(stat.type, stat.value)}
              </div>
              <div className="flex items-center text-xs">
                {stat.trend_direction ? (
                  <TrendingUp className={`h-3 w-3 ${
                    isModernTheme 
                      ? 'text-green-500'
                      : 'text-white/90'
                  } mr-1`} />
                ) : (
                  <TrendingDown className={`h-3 w-3 ${
                    isModernTheme 
                      ? 'text-red-500'
                      : 'text-white/90'
                  } mr-1`} />
                )}
                <span className={stat.trend_direction ? 'text-green-500' : 'text-red-500'}>
                  {stat.trend_direction ? '+' : ''}{stat.trend}%
                </span>
                <span className={`ml-1 ${
                  isModernTheme ? 'text-gray-500' : 'text-white/75'
                }`}>
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
