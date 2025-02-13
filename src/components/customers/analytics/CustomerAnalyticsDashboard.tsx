
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MetricCard } from "./components/MetricCard";
import { CustomerActivityTimeline } from "./components/CustomerActivityTimeline";
import { CustomerEngagementChart } from "./components/CustomerEngagementChart";
import { ValidationHistoryTimeline } from "./components/ValidationHistoryTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsLoadingSkeleton } from "./components/AnalyticsLoadingSkeleton";

interface CustomerAnalyticsDashboardProps {
  customerId: string;
}

export function CustomerAnalyticsDashboard({ customerId }: CustomerAnalyticsDashboardProps) {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ["customer-analytics", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_analytics_dashboard")
        .select("*")
        .eq("customer_id", customerId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load analytics data: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <AnalyticsLoadingSkeleton />;
  }

  if (!analytics) {
    return (
      <Alert>
        <AlertDescription>
          No analytics data available for this customer.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Customer Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Customer since {new Date(analytics.customer_since).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2">
                {analytics.churn_risk > 50 && (
                  <Badge variant="destructive">High Churn Risk</Badge>
                )}
                {analytics.engagement_score > 75 && (
                  <Badge variant="secondary">Highly Engaged</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Spend"
          value={`$${analytics.total_spend.toFixed(2)}`}
          subtitle="Lifetime value"
        />
        <MetricCard
          title="Engagement Score"
          value={analytics.engagement_score.toFixed(1)}
          subtitle="Out of 100"
        />
        <MetricCard
          title="Satisfaction Score"
          value={analytics.satisfaction_score.toFixed(1)}
          subtitle="Out of 5"
        />
        <MetricCard
          title="Loyalty Points"
          value={analytics.loyalty_points}
          subtitle="Current balance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerActivityTimeline 
          activities={analytics.recent_activities || []}
        />
        <ValidationHistoryTimeline customerId={customerId} />
      </div>

      <CustomerEngagementChart
        activities={analytics.recent_activities || []}
      />
    </div>
  );
}
