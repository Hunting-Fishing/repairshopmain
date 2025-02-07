
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
    ? 'hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white via-blue-50 to-blue-100/30 border border-blue-200/50 backdrop-blur-sm transform hover:scale-105'
    : 'hover:shadow-lg transition-shadow';

  const iconClass = isModernTheme
    ? 'text-[#0EA5E9]'
    : 'text-muted-foreground';

  const valueClass = isModernTheme
    ? 'bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] bg-clip-text text-transparent font-black'
    : '';

  const titleClass = isModernTheme
    ? 'text-gray-700 font-semibold'
    : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {stats.map((stat) => (
        <Card key={stat.title} className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${titleClass}`}>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${iconClass}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${valueClass}`}>
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
