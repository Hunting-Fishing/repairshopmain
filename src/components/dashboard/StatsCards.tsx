
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

interface StatsCardsProps {
  isModernTheme?: boolean;
}

const stats = [
  {
    title: "Total Work Orders",
    value: "156",
    icon: ClipboardList,
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Active Customers",
    value: "89",
    icon: Users,
    trend: "+4%",
    trendUp: true,
  },
  {
    title: "Pending Jobs",
    value: "24",
    icon: Wrench,
    trend: "-2%",
    trendUp: false,
  },
  {
    title: "Average Service Time",
    value: "2.5 hrs",
    icon: Clock,
    trend: "-5%",
    trendUp: true,
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    icon: Star,
    trend: "+2%",
    trendUp: true,
  }
];

export function StatsCards({ isModernTheme = false }: StatsCardsProps) {
  const cardClass = isModernTheme
    ? 'hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white via-orange-50 to-orange-100/30 border border-orange-200/50 backdrop-blur-sm'
    : 'hover:shadow-lg transition-shadow';

  const iconClass = isModernTheme
    ? 'text-[#F97316]'
    : 'text-muted-foreground';

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {stats.map((stat) => (
        <Card key={stat.title} className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isModernTheme ? 'text-gray-700' : ''}`}>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${iconClass}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isModernTheme ? 'bg-gradient-to-br from-[#F97316] to-[#EA580C] bg-clip-text text-transparent' : ''}`}>
              {stat.value}
            </div>
            <div className="flex items-center text-xs">
              {stat.trendUp ? (
                <TrendingUp className={`h-3 w-3 ${stat.trendUp ? 'text-green-500' : 'text-red-500'} mr-1`} />
              ) : (
                <TrendingDown className={`h-3 w-3 ${stat.trendUp ? 'text-green-500' : 'text-red-500'} mr-1`} />
              )}
              <span className={stat.trendUp ? 'text-green-500' : 'text-red-500'}>
                {stat.trend}
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
