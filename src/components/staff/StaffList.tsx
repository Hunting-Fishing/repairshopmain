
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { getRoleBadgeColor } from "../staff/role-management/types";

// Sample data - would be replaced with actual data from API
const demoStaffMembers = [
  { 
    id: "1", 
    first_name: "John", 
    last_name: "Smith", 
    role: "owner", 
    email: "john.smith@example.com",
    phone: "555-123-4567",
    status: "active"
  },
  { 
    id: "2", 
    first_name: "Jane", 
    last_name: "Doe", 
    role: "management", 
    email: "jane.doe@example.com",
    phone: "555-987-6543",
    status: "active"
  },
  { 
    id: "3", 
    first_name: "Michael", 
    last_name: "Johnson", 
    role: "technician", 
    email: "michael.j@example.com",
    phone: "555-456-7890",
    status: "active"
  },
  { 
    id: "4", 
    first_name: "Sarah", 
    last_name: "Williams", 
    role: "service_advisor", 
    email: "sarah.w@example.com",
    phone: "555-789-0123",
    status: "inactive"
  }
];

export function StaffList() {
  const [isLoading, setIsLoading] = useState(false);
  const staffMembers = demoStaffMembers;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Staff</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      {staff.first_name} {staff.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(staff.role)}>
                        {staff.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>
                      <Badge variant={staff.status === 'active' ? 'success' : 'secondary'}>
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
