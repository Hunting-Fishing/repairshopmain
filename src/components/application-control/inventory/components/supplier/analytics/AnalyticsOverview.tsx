import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Package, Star, Clock, AlertTriangle, Percent, ChartBar } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { SupplierAnalyticsData } from "../../../types";

interface AnalyticsOverviewProps {
  analytics: SupplierAnalyticsData;
}

export function AnalyticsOverview({ analytics }: AnalyticsOverviewProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const spendData = [
    { name: 'Spend', value: timeframe === 'daily' ? analytics.daily_spend : 
                          timeframe === 'weekly' ? analytics.weekly_spend : 
                          analytics.monthly_spend },
    { name: 'Savings', value: (analytics.negotiated_savings || 0) + (analytics.early_payment_discounts || 0) + (analytics.volume_discounts || 0) },
    { name: 'Rebates', value: analytics.rebates_amount || 0 },
    { name: 'Discounts', value: analytics.discounts_amount || 0 },
  ];

  const performanceData = [
    { name: 'Quality', value: analytics.quality_rating || 0 },
    { name: 'Delivery', value: analytics.on_time_delivery_rate || 0 },
    { name: 'Payment', value: analytics.payment_terms_compliance || 0 },
    { name: 'Contract', value: analytics.contract_compliance_rate || 0 },
  ];

  const seasonalData = [
    { name: 'Q1', value: analytics.seasonal_spend_pattern?.Q1 || 0 },
    { name: 'Q2', value: analytics.seasonal_spend_pattern?.Q2 || 0 },
    { name: 'Q3', value: analytics.seasonal_spend_pattern?.Q3 || 0 },
    { name: 'Q4', value: analytics.seasonal_spend_pattern?.Q4 || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
          title="Total Spend"
          value={`$${spendData[0].value.toLocaleString()}`}
          icon={DollarSign}
          description={`${timeframe} spend`}
        />
        <AnalyticsCard
          title="Cost Savings"
          value={`$${(analytics.negotiated_savings || 0).toLocaleString()}`}
          icon={TrendingUp}
          description="Total negotiated savings"
        />
        <AnalyticsCard
          title="Risk Score"
          value={(analytics.supply_chain_risk_score || 0).toFixed(1)}
          icon={AlertTriangle}
          description="Supply chain risk assessment"
        />
        <AnalyticsCard
          title="Sustainability"
          value={(analytics.sustainability_score || 0).toFixed(1)}
          icon={ChartBar}
          description="Environmental impact score"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Spending Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={seasonalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {seasonalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Defect Rate</p>
                <p className="text-2xl font-bold">{analytics.defect_rate || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contract Compliance</p>
                <p className="text-2xl font-bold">{analytics.contract_compliance_rate || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Compliance</p>
                <p className="text-2xl font-bold">{analytics.payment_terms_compliance || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Market Price Variance</p>
                <p className="text-2xl font-bold">{analytics.market_price_variance || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}