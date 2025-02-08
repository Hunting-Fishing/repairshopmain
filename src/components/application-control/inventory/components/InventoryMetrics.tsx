
import { DollarSign, Package, AlertTriangle, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryMetrics } from "../hooks/useInventoryMetrics";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryMetrics() {
  const { data: metrics, isLoading } = useInventoryMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: "Total Value",
      value: `$${(metrics?.total_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      className: "text-green-500",
    },
    {
      title: "Total Items",
      value: (metrics?.total_items || 0).toLocaleString(),
      icon: Package,
      className: "text-blue-500",
    },
    {
      title: "Low Stock Items",
      value: (metrics?.low_stock_items || 0).toLocaleString(),
      icon: AlertTriangle,
      className: "text-yellow-500",
    },
    {
      title: "Out of Stock",
      value: (metrics?.out_of_stock_items || 0).toLocaleString(),
      icon: TrendingDown,
      className: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {metricCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.className}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
