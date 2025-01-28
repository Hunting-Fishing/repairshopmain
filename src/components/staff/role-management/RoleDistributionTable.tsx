import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StaffMember, CustomRole } from "./types";

interface RoleDistributionTableProps {
  staffMembers: StaffMember[];
  customRoles: CustomRole[];
}

export function RoleDistributionTable({ staffMembers, customRoles }: RoleDistributionTableProps) {
  const getRoleCounts = () => {
    const counts = new Map<string, number>();
    staffMembers.forEach(member => {
      const roleKey = member.role === 'custom' && member.custom_role_id && customRoles
        ? customRoles.find(r => r.id === member.custom_role_id)?.name || 'Custom Role'
        : member.role;
      counts.set(roleKey, (counts.get(roleKey) || 0) + 1);
    });
    
    return Array.from(counts.entries()).map(([role, count]) => ({
      role: role.replace('_', ' ').toUpperCase(),
      count
    }));
  };

  const roleCounts = getRoleCounts();
  const totalStaff = staffMembers.length;

  return (
    <div className="bg-muted/50 p-4 rounded-lg mb-6">
      <h3 className="text-sm font-medium mb-2">Role Distribution ({totalStaff} Total Staff)</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Staff Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roleCounts.map(({ role, count }) => (
            <TableRow key={role}>
              <TableCell>{role}</TableCell>
              <TableCell className="text-right">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}