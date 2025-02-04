import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingUp, Package, Star, Clock, AlertTriangle, Receipt, Percent } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import type { SupplierAnalyticsData } from "../../../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AnalyticsOverviewProps {
  analytics: SupplierAnalyticsData;
}

export function AnalyticsOverview({ analytics }: AnalyticsOverviewProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const spendData = [
    { name: 'Spend', value: timeframe === 'daily' ? analytics.daily_spend : 
                          timeframe === 'weekly' ? analytics.weekly_spend : 
                          analytics.monthly_spend },
    { name: 'Bill Out', value: analytics.bill_out_total },
    { name: 'Rebates', value: analytics.rebates_amount },
    { name: 'Discounts', value: analytics.discounts_amount },
  ];

  const performanceData = [
    { name: 'Quality', value: analytics.quality_rating },
    { name: 'Delivery', value: analytics.on_time_delivery_rate },
    { name: 'Payment', value: analytics.payment_timeliness_score },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={timeframe} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeframe(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily View</SelectItem>
            <SelectItem value="weekly">Weekly View</SelectItem>
            <SelectItem value="monthly">Monthly View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title={`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Spend`}
          value={`$${timeframe === 'daily' ? analytics.daily_spend.toLocaleString() : 
                   timeframe === 'weekly' ? analytics.weekly_spend.toLocaleString() : 
                   analytics.monthly_spend.toLocaleString()}`}
          icon={DollarSign}
          description={`Total ${timeframe} spend`}
        />
        <AnalyticsCard
          title="Bill Out Total"
          value={`$${analytics.bill_out_total.toLocaleString()}`}
          icon={Receipt}
          description="Total billed amount"
        />
        <AnalyticsCard
          title="Profit Margin"
          value={`${analytics.profit_margin.toFixed(1)}%`}
          icon={Percent}
          description="Average profit margin"
        />
        <AnalyticsCard
          title="Rebates & Discounts"
          value={`$${(analytics.rebates_amount + analytics.discounts_amount).toLocaleString()}`}
          icon={TrendingUp}
          description="Total savings"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
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