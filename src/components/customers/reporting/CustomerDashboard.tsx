
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DashboardConfig } from './types';
import { ChartWidget } from './widgets/ChartWidget';

export function CustomerDashboard() {
  const { data: dashboardConfig } = useQuery({
    queryKey: ['dashboard-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_configurations')
        .select('*')
        .eq('is_default', true)
        .single();

      if (error) throw error;
      return data as DashboardConfig;
    }
  });

  // Mock data for demonstration
  const mockData = {
    chart: [
      { name: 'Jan', value: 100 },
      { name: 'Feb', value: 200 },
      { name: 'Mar', value: 150 },
      { name: 'Apr', value: 300 },
    ],
    metric: 42,
    list: ['Item 1', 'Item 2', 'Item 3'],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Dashboard</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardConfig?.layout.map((widget) => {
          if (widget.type === 'chart') {
            return (
              <ChartWidget
                key={widget.id}
                widget={widget}
                data={mockData.chart}
              />
            );
          }

          return (
            <Card key={widget.id}>
              <CardHeader>
                <CardTitle>{widget.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {widget.type === 'metric' && (
                  <div className="text-4xl font-bold">{mockData.metric}</div>
                )}
                {widget.type === 'list' && (
                  <ul className="space-y-2">
                    {mockData.list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
