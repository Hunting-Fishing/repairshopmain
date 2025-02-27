
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StaffMember, getRoleBadgeColor } from "./types";

interface RoleDistributionTableProps {
  staffMembers: StaffMember[];
}

export function RoleDistributionTable({ staffMembers }: RoleDistributionTableProps) {
  // Calculate role distribution
  const roleDistribution = staffMembers.reduce((acc, member) => {
    const role = member.role;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort roles by count (descending)
  const sortedRoles = Object.entries(roleDistribution).sort((a, b) => b[1] - a[1]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Count</TableHead>
          <TableHead>Percentage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRoles.map(([role, count]) => (
          <TableRow key={role}>
            <TableCell>
              <Badge className={getRoleBadgeColor(role)}>
                {role.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>{count}</TableCell>
            <TableCell>
              {Math.round((count / staffMembers.length) * 100)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
