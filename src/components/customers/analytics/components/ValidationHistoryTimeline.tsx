
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationStatus } from "../../ValidationStatus";
import { TimelineItem } from "./TimelineItem";

interface ValidationHistoryTimelineProps {
  customerId: string;
}

export function ValidationHistoryTimeline({ customerId }: ValidationHistoryTimelineProps) {
  const { data: analytics } = useQuery({
    queryKey: ['customer-analytics', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_analytics')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: validationLogs } = useQuery({
    queryKey: ['validation-logs', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_validation_logs')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Validation History</CardTitle>
        {analytics && (
          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
            <div>
              <p className="text-muted-foreground">Success Rate</p>
              <p className="font-medium">{analytics.validation_success_rate?.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Validations</p>
              <p className="font-medium">{analytics.total_validations}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pending Validations</p>
              <p className="font-medium">{analytics.pending_validations}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Validation</p>
              <p className="font-medium">
                {analytics.last_validation_date ? new Date(analytics.last_validation_date).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {validationLogs?.map((log) => (
          <div key={log.id} className="flex flex-col gap-2 pb-4 border-b last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground capitalize">
                {log.validation_type} Validation
              </span>
              <ValidationStatus 
                status={log.status}
                type={log.validation_type}
                message={log.error_message}
              />
            </div>
            <TimelineItem 
              label={log.error_message || `${log.validation_type} validation ${log.status}`}
              date={log.created_at}
            />
          </div>
        ))}
        {(!validationLogs || validationLogs.length === 0) && (
          <div className="text-center text-muted-foreground py-4">
            No validation history available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
