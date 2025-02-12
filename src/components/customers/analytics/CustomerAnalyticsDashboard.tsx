
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MetricCard } from "./components/MetricCard";
import { CustomerActivityTimeline } from "./components/CustomerActivityTimeline";
import { CustomerEngagementChart } from "./components/CustomerEngagementChart";
import { CustomerTags } from "./components/CustomerTags";
import { AnalyticsLoadingSkeleton } from "./components/AnalyticsLoadingSkeleton";

interface CustomerAnalyticsDashboardProps {
  customerId: string;
}

export function CustomerAnalyticsDashboard({ customerId }: CustomerAnalyticsDashboardProps) {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ["customer-analytics", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_analytics")
        .select("*")
        .eq("customer_id", customerId)
        .single();

      if (error) throw error;
      return data;
    },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Spend"
          value={`$${analytics.total_spend.toFixed(2)}`}
          subtitle="Lifetime value"
        />
        <MetricCard
          title="Loyalty Points"
          value={analytics.loyalty_points}
          subtitle="Current balance"
        />
        <MetricCard
          title="Total Jobs"
          value={analytics.total_repair_jobs}
          subtitle="Completed repairs"
        />
      </div>

      <CustomerActivityTimeline
        lastRepairDate={analytics.last_repair_date}
        lastFeedbackDate={analytics.last_feedback_date}
        customerSince={analytics.customer_since}
      />

      <CustomerEngagementChart
        totalRepairJobs={analytics.total_repair_jobs}
        totalFeedback={analytics.total_feedback}
        totalDocuments={analytics.total_documents}
        loyaltyActivities={analytics.loyalty_activities}
      />

      {analytics.tags && <CustomerTags tags={analytics.tags} />}
    </div>
  );
}
