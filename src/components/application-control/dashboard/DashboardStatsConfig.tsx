
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

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

  const { data: settings, isLoading } = useQuery({
    queryKey: ['dashboard-stats-config'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { enabled_stats: defaultStats, stats_order: [] };

      const { data, error } = await supabase
        .from('dashboard_settings')
        .select('enabled_stats, stats_order')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching stats:', error);
        throw error;
      }

      // If no settings exist yet, create default settings
      if (!data) {
        const defaultSettings = {
          user_id: user.id,
          enabled_stats: defaultStats,
          stats_order: defaultStats.map((stat, index) => ({ id: stat, order: index + 1 }))
        };

        const { error: insertError } = await supabase
          .from('dashboard_settings')
          .insert(defaultSettings);

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          throw insertError;
        }

        return defaultSettings;
      }

      return {
        enabled_stats: data.enabled_stats,
        stats_order: data.stats_order || defaultStats.map((stat, index) => ({ id: stat, order: index + 1 }))
      };
    }
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (newSettings: { enabled_stats: string[], stats_order: Array<{ id: string, order: number }> }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('dashboard_settings')
        .upsert({
          user_id: user.id,
          enabled_stats: newSettings.enabled_stats,
          stats_order: newSettings.stats_order
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
    if (!settings) return;

    const newEnabledStats = settings.enabled_stats.includes(statId)
      ? settings.enabled_stats.filter(id => id !== statId)
      : [...settings.enabled_stats, statId];

    // Update order when enabling/disabling stats
    const newOrder = newEnabledStats.map((stat, index) => ({
      id: stat,
      order: index + 1
    }));

    updateSettings({
      enabled_stats: newEnabledStats,
      stats_order: newOrder
    });
  };

  const handleDragEnd = (items: Array<{ id: string, order: number }>) => {
    if (!settings) return;

    updateSettings({
      enabled_stats: settings.enabled_stats,
      stats_order: items
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const sortedStats = [...availableStats].sort((a, b) => {
    const aOrder = settings?.stats_order?.find(item => item.id === a.id)?.order || 0;
    const bOrder = settings?.stats_order?.find(item => item.id === b.id)?.order || 0;
    return aOrder - bOrder;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Statistics</CardTitle>
        <CardDescription>
          Choose which statistics to display on your dashboard and drag to reorder them
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedStats.map((stat, index) => (
            <div 
              key={stat.id} 
              className="flex items-center justify-between space-x-4 p-4 rounded-lg border cursor-move"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', stat.id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/plain');
                const newOrder = [...(settings?.stats_order || [])];
                const draggedIndex = newOrder.findIndex(item => item.id === draggedId);
                const dropIndex = newOrder.findIndex(item => item.id === stat.id);
                
                if (draggedIndex !== -1 && dropIndex !== -1) {
                  const [removed] = newOrder.splice(draggedIndex, 1);
                  newOrder.splice(dropIndex, 0, removed);
                  
                  // Update order numbers
                  newOrder.forEach((item, i) => {
                    item.order = i + 1;
                  });
                  
                  handleDragEnd(newOrder);
                }
              }}
            >
              <div className="flex items-center space-x-4">
                <DragHandleDots2Icon className="h-5 w-5 text-gray-400" />
                <Label htmlFor={stat.id} className="flex flex-col space-y-1">
                  <span className="font-medium">Card {index + 1} - {stat.label}</span>
                </Label>
              </div>
              <Switch
                id={stat.id}
                checked={settings?.enabled_stats?.includes(stat.id)}
                onCheckedChange={() => handleToggle(stat.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
