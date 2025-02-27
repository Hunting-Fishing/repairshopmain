
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffMember } from "@/types/staff";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StatusDistributionChartProps {
  staffMembers: StaffMember[];
}

export function StatusDistributionChart({ staffMembers }: StatusDistributionChartProps) {
  // Count staff members by status
  const statusCount: Record<string, number> = {};
  
  staffMembers?.forEach(staff => {
    const status = staff.status || 'unknown';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
  
  const data = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} staff members`, 'Count']}
                labelFormatter={(label) => `Status: ${label}`}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
