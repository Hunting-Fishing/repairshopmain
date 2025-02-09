
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
    gradient: "from-blue-500 to-purple-600",
  },
  {
    title: "Active Customers",
    value: "89",
    icon: Users,
    trend: "+4%",
    trendUp: true,
    gradient: "from-green-500 to-teal-600",
  },
  {
    title: "Pending Jobs",
    value: "24",
    icon: Wrench,
    trend: "-2%",
    trendUp: false,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Average Service Time",
    value: "2.5 hrs",
    icon: Clock,
    trend: "-5%",
    trendUp: true,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    icon: Star,
    trend: "+2%",
    trendUp: true,
    gradient: "from-violet-500 to-purple-600",
  }
];

export function StatsCards({ isModernTheme = false }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
            isModernTheme 
              ? 'bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl'
              : 'bg-gradient-to-br ' + stat.gradient + ' text-white'
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className={`text-sm font-medium ${
                isModernTheme ? 'text-gray-700' : 'text-white/90'
              }`}>
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${
                isModernTheme ? 'text-blue-500' : 'text-white/90'
              }`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold mb-1 ${
              isModernTheme 
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent'
                : 'text-white'
            }`}>
              {stat.value}
            </div>
            <div className="flex items-center text-xs">
              {stat.trendUp ? (
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
              <span className={stat.trendUp ? 'text-green-500' : 'text-red-500'}>
                {stat.trend}
              </span>
              <span className={`ml-1 ${
                isModernTheme ? 'text-gray-500' : 'text-white/75'
              }`}>
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
