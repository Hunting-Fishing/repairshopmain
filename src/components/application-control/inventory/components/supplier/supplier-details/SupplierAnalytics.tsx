import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupplierAnalytics } from "../hooks/useSupplierAnalytics";
import { BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SupplierAnalyticsProps {
  supplierId: string;
}

export function SupplierAnalytics({ supplierId }: SupplierAnalyticsProps) {
  const { analytics, isLoading } = useSupplierAnalytics(supplierId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Orders Fulfilled",
      value: analytics?.orders_fulfilled || 0,
      icon: CheckCircle,
    },
    {
      title: "On-Time Delivery",
      value: `${(analytics?.on_time_delivery_rate || 0).toFixed(1)}%`,
      icon: Clock,
    },
    {
      title: "Quality Rating",
      value: (analytics?.quality_rating || 0).toFixed(1),
      icon: TrendingUp,
    },
    {
      title: "Payment Score",
      value: (analytics?.payment_timeliness_score || 0).toFixed(1),
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}