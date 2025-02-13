import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  return <div className="bg-muted/50 p-4 mb-6 rounded-sm">
      <h3 className="text-sm font-medium mb-2">Role Distribution ({totalStaff} Total Staff)</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Staff Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roleCounts.map(({
          role,
          count
        }) => <TableRow key={role}>
              <TableCell>{role}</TableCell>
              <TableCell className="text-right">{count}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
    </div>;
}