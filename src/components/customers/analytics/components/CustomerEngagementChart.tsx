
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      acc.push({ name: type, value: 1 });
    }
    
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
  );
}
