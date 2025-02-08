
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

  // Default values if no metrics exist yet
  const defaultMetrics = {
    total_value: 0,
    total_items: 0,
    low_stock_items: 0,
    out_of_stock_items: 0
  };

  // Use metrics if they exist, otherwise use default values
  const currentMetrics = metrics || defaultMetrics;

  const metricCards = [
    {
      title: "Total Value",
      value: `$${currentMetrics.total_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      className: "text-green-500",
    },
    {
      title: "Total Items",
      value: currentMetrics.total_items.toLocaleString(),
      icon: Package,
      className: "text-blue-500",
    },
    {
      title: "Low Stock Items",
      value: currentMetrics.low_stock_items.toLocaleString(),
      icon: AlertTriangle,
      className: "text-yellow-500",
    },
    {
      title: "Out of Stock",
      value: currentMetrics.out_of_stock_items.toLocaleString(),
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
