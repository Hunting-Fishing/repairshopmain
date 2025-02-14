
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TechnicianWorkload {
  technician_id: string;
  total_hours: number;
  booking_count: number;
  technician: {
    first_name: string;
    last_name: string;
  };
}

export function WorkloadMonitor() {
  const { data: workloads, isLoading } = useQuery({
    queryKey: ['technician-workloads'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('technician_workload')
        .select(`
          *,
          technician:profiles(first_name, last_name)
        `)
        .eq('date', today);

      if (error) throw error;
      return data as TechnicianWorkload[];
    }
  });

  const MAX_DAILY_HOURS = 8;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Workload Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading workload data...</div>
          ) : (
            workloads?.map((workload) => (
              <div key={workload.technician_id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {workload.technician.first_name} {workload.technician.last_name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {workload.booking_count} bookings
                  </span>
                </div>
                <Progress 
                  value={(workload.total_hours / MAX_DAILY_HOURS) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{workload.total_hours.toFixed(1)} hours</span>
                  <span>{MAX_DAILY_HOURS} hours max</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
