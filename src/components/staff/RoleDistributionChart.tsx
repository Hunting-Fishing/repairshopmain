
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffMember } from "@/types/staff";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface RoleDistributionChartProps {
  staffMembers: StaffMember[];
}

export function RoleDistributionChart({ staffMembers }: RoleDistributionChartProps) {
  // Count staff members by role
  const roleCount: Record<string, number> = {};
  
  staffMembers?.forEach(staff => {
    const role = staff.custom_roles?.name || staff.role;
    roleCount[role] = (roleCount[role] || 0) + 1;
  });
  
  const data = Object.entries(roleCount).map(([name, value]) => ({
    name,
    value
  }));
  
  // Define colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#45B39D', '#F5B041'];
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Staff Role Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} staff members`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
