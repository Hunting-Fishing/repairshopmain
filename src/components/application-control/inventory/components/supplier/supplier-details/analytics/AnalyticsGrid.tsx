import { DollarSign, Package, TrendingUp, Clock } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import type { SupplierAnalyticsData } from "../../../types";

interface AnalyticsGridProps {
  analytics: SupplierAnalyticsData;
}

export function AnalyticsGrid({ analytics }: AnalyticsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AnalyticsCard
        title="Total Spend"
        value={`$${analytics.total_spend.toLocaleString()}`}
        icon={DollarSign}
        description="Total amount spent with this supplier"
      />
      <AnalyticsCard
        title="Orders Fulfilled"
        value={analytics.orders_fulfilled}
        icon={Package}
        description="Total orders completed"
      />
      <AnalyticsCard
        title="On-Time Delivery"
        value={`${analytics.on_time_delivery_rate}%`}
        icon={TrendingUp}
        description="Delivery success rate"
      />
      <AnalyticsCard
        title="Avg Lead Time"
        value={`${analytics.average_lead_time} days`}
        icon={Clock}
        description="Average time from order to delivery"
      />
    </div>
  );
}