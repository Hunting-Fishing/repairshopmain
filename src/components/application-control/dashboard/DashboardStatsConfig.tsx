
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const availableStats = [
  { id: 'total_work_orders', label: 'Total Work Orders' },
  { id: 'active_customers', label: 'Active Customers' },
  { id: 'pending_jobs', label: 'Pending Jobs' },
  { id: 'average_service_time', label: 'Average Service Time' },
  { id: 'customer_satisfaction', label: 'Customer Satisfaction' },
  { id: 'revenue_today', label: 'Today\'s Revenue' },
  { id: 'technician_utilization', label: 'Technician Utilization' },
  { id: 'parts_inventory', label: 'Parts in Stock' },
  { id: 'appointments_today', label: 'Today\'s Appointments' },
  { id: 'average_wait_time', label: 'Average Wait Time' }
];

const defaultStats = ['total_work_orders', 'active_customers', 'pending_jobs', 'average_service_time', 'customer_satisfaction'];

export function DashboardStatsConfig() {
  const queryClient = useQueryClient();

  const { data: enabledStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats-config'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return defaultStats;

      const { data, error } = await supabase
        .from('dashboard_settings')
        .select('enabled_stats')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching stats:', error);
        throw error;
      }

      // If no settings exist yet, create default settings
      if (!data) {
        const { error: insertError } = await supabase
          .from('dashboard_settings')
          .insert({
            user_id: user.id,
            enabled_stats: defaultStats
          });

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          throw insertError;
        }

        return defaultStats;
      }

      return data.enabled_stats;
    }
  });

  const { mutate: updateStats } = useMutation({
    mutationFn: async (stats: string[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('dashboard_settings')
        .upsert({
          user_id: user.id,
          enabled_stats: stats
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats-config'] });
      toast.success('Dashboard statistics updated successfully');
    },
    onError: (error) => {
      console.error('Error updating stats:', error);
      toast.error('Failed to update dashboard statistics');
    }
  });

  const handleToggle = (statId: string) => {
    if (!enabledStats) return;

    const newStats = enabledStats.includes(statId)
      ? enabledStats.filter(id => id !== statId)
      : [...enabledStats, statId];

    updateStats(newStats);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Statistics</CardTitle>
        <CardDescription>
          Choose which statistics to display on your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableStats.map((stat) => (
            <div key={stat.id} className="flex items-center justify-between space-x-4 p-4 rounded-lg border">
              <Label htmlFor={stat.id} className="flex flex-col space-y-1">
                <span className="font-medium">{stat.label}</span>
              </Label>
              <Switch
                id={stat.id}
                checked={enabledStats?.includes(stat.id)}
                onCheckedChange={() => handleToggle(stat.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
