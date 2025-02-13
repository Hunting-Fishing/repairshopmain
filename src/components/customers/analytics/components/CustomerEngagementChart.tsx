
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface CustomerEngagementChartProps {
  activities: Array<{
    type: string;
    date: string;
    data: Record<string, any>;
  }>;
  customerId: string;
}

export function CustomerEngagementChart({ activities: initialActivities, customerId }: CustomerEngagementChartProps) {
  const [activities, setActivities] = useState(initialActivities);

  useEffect(() => {
    setActivities(initialActivities);
  }, [initialActivities]);

  useEffect(() => {
    const channel = supabase
      .channel('customer-engagement')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customer_engagement_events',
          filter: `customer_id=eq.${customerId}`
        },
        (payload) => {
          console.log('New engagement event:', payload);
          setActivities(current => [...current, {
            type: payload.new.event_type,
            date: payload.new.created_at,
            data: payload.new.event_data
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [customerId]);

  // Process activities into chart data
  const chartData = activities.reduce((acc, activity) => {
    const type = activity.type.replace('_', ' ');
    const existingType = acc.find(item => item.name === type);
    
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ 
        name: type, 
        value: 1,
        color: getActivityColor(activity.type)
      });
    }
    
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Engagement Distribution</span>
          <div className="text-sm font-normal text-muted-foreground">
            Total Activities: {activities.length}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs" 
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function getActivityColor(type: string): string {
  const colors = {
    repair: '#3b82f6',
    feedback: '#10b981',
    loyalty_redemption: '#6366f1',
    communication: '#f59e0b',
    document_upload: '#8b5cf6',
    appointment_booking: '#ec4899',
    payment: '#14b8a6',
    default: '#6b7280'
  };

  return colors[type as keyof typeof colors] || colors.default;
}
