
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CustomerEngagementChartProps {
  activities: Array<{
    type: string;
    date: string;
    data: Record<string, any>;
  }>;
}

export function CustomerEngagementChart({ activities }: CustomerEngagementChartProps) {
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
        // Assign different colors based on engagement type
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
    repair: '#3b82f6',         // Blue
    feedback: '#10b981',       // Green
    loyalty_redemption: '#6366f1', // Indigo
    communication: '#f59e0b',  // Amber
    document_upload: '#8b5cf6', // Purple
    appointment_booking: '#ec4899', // Pink
    payment: '#14b8a6',        // Teal
    default: '#6b7280'         // Gray
  };

  return colors[type as keyof typeof colors] || colors.default;
}
