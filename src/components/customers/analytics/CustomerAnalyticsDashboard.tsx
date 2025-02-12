
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

      <Card>
        <CardHeader>
          <CardTitle>Customer Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.last_repair_date && (
              <TimelineItem
                label="Last Repair"
                date={analytics.last_repair_date}
              />
            )}
            {analytics.last_feedback_date && (
              <TimelineItem
                label="Last Feedback"
                date={analytics.last_feedback_date}
              />
            )}
            {analytics.customer_since && (
              <TimelineItem
                label="Customer Since"
                date={analytics.customer_since}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Repair Jobs', value: analytics.total_repair_jobs },
                  { name: 'Feedback', value: analytics.total_feedback },
                  { name: 'Documents', value: analytics.total_documents },
                  { name: 'Loyalty Activities', value: analytics.loyalty_activities },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
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

      {analytics.tags && analytics.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ title, value, subtitle }: { title: string, value: string | number, subtitle: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ label, date }: { label: string, date: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">
        {format(new Date(date), 'PPP')}
      </span>
    </div>
  );
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
