import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingUp, Package, Star, Clock, AlertTriangle } from "lucide-react";
import { AnalyticsCard } from "../supplier-details/analytics/AnalyticsCard";
import type { SupplierAnalyticsData } from "../../../types";

interface SupplierAnalyticsOverviewProps {
  analytics: SupplierAnalyticsData;
}

export function SupplierAnalyticsOverview({ analytics }: SupplierAnalyticsOverviewProps) {
  const orderData = [
    { name: 'Total Orders', value: analytics.orders_count },
    { name: 'Fulfilled', value: analytics.orders_fulfilled },
    { name: 'On Time', value: Math.round(analytics.orders_fulfilled * (analytics.on_time_delivery_rate / 100)) },
  ];

  const performanceData = [
    { name: 'Quality', value: analytics.quality_rating },
    { name: 'Delivery', value: analytics.on_time_delivery_rate },
    { name: 'Payment', value: analytics.payment_timeliness_score },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnalyticsCard
          title="Total Spend"
          value={`$${analytics.total_spend.toLocaleString()}`}
          icon={DollarSign}
          description="Total amount spent"
          trend={analytics.total_spend > 10000 ? "up" : "neutral"}
        />
        <AnalyticsCard
          title="Order Fulfillment"
          value={`${(analytics.orders_fulfilled / analytics.orders_count * 100).toFixed(1)}%`}
          icon={Package}
          description={`${analytics.orders_fulfilled} of ${analytics.orders_count} orders`}
          trend={analytics.orders_fulfilled / analytics.orders_count > 0.9 ? "up" : "down"}
        />
        <AnalyticsCard
          title="Quality Score"
          value={analytics.quality_rating.toFixed(1)}
          icon={Star}
          description="Average quality rating"
          trend={analytics.quality_rating > 4 ? "up" : "neutral"}
        />
        <AnalyticsCard
          title="On-Time Delivery"
          value={`${analytics.on_time_delivery_rate}%`}
          icon={Clock}
          description="Delivery success rate"
          trend={analytics.on_time_delivery_rate > 95 ? "up" : "down"}
        />
        <AnalyticsCard
          title="Lead Time"
          value={`${analytics.average_lead_time} days`}
          icon={TrendingUp}
          description="Average order to delivery"
          trend={analytics.average_lead_time < 7 ? "up" : "down"}
        />
        <AnalyticsCard
          title="Return Rate"
          value={`${analytics.return_rate}%`}
          icon={AlertTriangle}
          description="Products returned"
          trend={analytics.return_rate < 5 ? "up" : "down"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}