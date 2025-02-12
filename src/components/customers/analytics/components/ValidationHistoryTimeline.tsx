
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidationStatus } from "../../ValidationStatus";
import { TimelineItem } from "./TimelineItem";

interface ValidationHistoryTimelineProps {
  customerId: string;
}

export function ValidationHistoryTimeline({ customerId }: ValidationHistoryTimelineProps) {
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
