import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBar, TrendingUp, DollarSign, Package } from "lucide-react";
import { AnalyticsCard } from "../supplier-details/analytics/AnalyticsCard";
import type { SupplierAnalyticsData } from "../../../types";

interface SupplierAnalyticsOverviewProps {
  analytics: SupplierAnalyticsData;
}

export function SupplierAnalyticsOverview({ analytics }: SupplierAnalyticsOverviewProps) {
  const chartData = [
    { name: 'Orders', value: analytics.orders_count },
    { name: 'Fulfilled', value: analytics.orders_fulfilled },
    { name: 'On Time', value: Math.round(analytics.orders_fulfilled * (analytics.on_time_delivery_rate / 100)) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Spend"
          value={`$${analytics.total_spend.toLocaleString()}`}
          icon={DollarSign}
          description="Total amount spent with supplier"
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
          title="Quality Rating"
          value={analytics.quality_rating.toFixed(1)}
          icon={ChartBar}
          description="Average quality score"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}