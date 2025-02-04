import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  DollarSign, 
  Users, 
  Wrench,
  TrendingUp,
  TrendingDown,
  Clock,
  Star 
} from "lucide-react";

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
    title: "Revenue (MTD)",
    value: "$45,231",
    icon: DollarSign,
    trend: "+8%",
    trendUp: true,
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

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs">
              {stat.trendUp ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={stat.trendUp ? "text-green-500" : "text-red-500"}>
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