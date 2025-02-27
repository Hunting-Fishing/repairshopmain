
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Award } from "lucide-react";
import { StaffMember } from "@/types/staff";

interface StaffMetricsProps {
  staffMembers: StaffMember[];
}

export function StaffMetrics({ staffMembers }: StaffMetricsProps) {
  // Calculate metrics
  const totalStaff = staffMembers?.length || 0;
  const activeStaff = staffMembers?.filter(s => s.status === 'active').length || 0;
  const inactiveStaff = staffMembers?.filter(s => s.status !== 'active').length || 0;
  
  // Group by role and find the most common role
  const roleCount: Record<string, number> = {};
  staffMembers?.forEach(staff => {
    const role = staff.custom_roles?.name || staff.role;
    roleCount[role] = (roleCount[role] || 0) + 1;
  });
  
  const primaryRole = Object.entries(roleCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStaff}</div>
          <p className="text-xs text-muted-foreground">
            Members in organization
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeStaff}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((activeStaff / totalStaff) * 100) || 0}% of total staff
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Staff</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveStaff}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((inactiveStaff / totalStaff) * 100) || 0}% of total staff
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Primary Role</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{primaryRole}</div>
          <p className="text-xs text-muted-foreground">
            {roleCount[primaryRole] || 0} team members
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
