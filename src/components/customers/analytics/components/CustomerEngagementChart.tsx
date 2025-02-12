
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface CustomerEngagementChartProps {
  totalRepairJobs: number;
  totalFeedback: number;
  totalDocuments: number;
  loyaltyActivities: number;
}

export function CustomerEngagementChart({
  totalRepairJobs,
  totalFeedback,
  totalDocuments,
  loyaltyActivities
}: CustomerEngagementChartProps) {
  const data = [
    { name: 'Repair Jobs', value: totalRepairJobs },
    { name: 'Feedback', value: totalFeedback },
    { name: 'Documents', value: totalDocuments },
    { name: 'Loyalty Activities', value: loyaltyActivities },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
  );
}
