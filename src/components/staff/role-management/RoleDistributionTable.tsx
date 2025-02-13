
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { StaffMember, CustomRole } from "./types";
import { roles } from "./types";

interface RoleDistributionTableProps {
  staffMembers: StaffMember[];
  customRoles: CustomRole[];
}

export function RoleDistributionTable({
  staffMembers,
  customRoles
}: RoleDistributionTableProps) {
  const getRoleCounts = () => {
    // Initialize counts with 0 for all standard roles
    const counts = new Map<string, number>(roles.map(role => [role, 0]));

    // Add custom roles with 0 count
    customRoles.forEach(customRole => {
      counts.set(customRole.name, 0);
    });

    // Count actual staff members
    staffMembers.forEach(member => {
      if (member.role === 'custom' && member.custom_role_id) {
        const customRoleName = customRoles.find(r => r.id === member.custom_role_id)?.name;
        if (customRoleName) {
          counts.set(customRoleName, (counts.get(customRoleName) || 0) + 1);
        }
      } else {
        counts.set(member.role, (counts.get(member.role) || 0) + 1);
      }
    });
    return Array.from(counts.entries()).map(([role, count]) => ({
      role: role.replace('_', ' ').toUpperCase(),
      count
    }));
  };

  const roleCounts = getRoleCounts();
  const totalStaff = staffMembers.length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">Role Distribution</CardTitle>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            {totalStaff} Total Staff
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[70%] font-medium">Role</TableHead>
              <TableHead className="text-right font-medium">Staff Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roleCounts.map(({role, count}) => (
              <TableRow key={role} className="group transition-colors hover:bg-muted/50">
                <TableCell className="font-medium">{role}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full bg-background shadow-sm">
                    {count}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
