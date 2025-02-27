
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
import { getRoleBadgeColor } from "./role-management/types";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";
import { toast } from "@/hooks/use-toast";
import { DeleteStaffDialog } from "./DeleteStaffDialog";
import { EditStaffDialog } from "./EditStaffDialog";
import { StaffMember } from "@/types/staff";

export function StaffList() {
  const { data: staffMembers, isLoading, error } = useStaffMembers();
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (error) {
    console.error("Error loading staff members:", error);
    toast({
      title: "Error",
      description: "Failed to load staff members",
      variant: "destructive"
    });
  }

  const handleEditClick = (staffMember: StaffMember) => {
    setSelectedMember(staffMember);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (staffMember: StaffMember) => {
    setSelectedMember(staffMember);
    setIsDeleteDialogOpen(true);
  };

  const handleAddStaffClick = () => {
    // Navigate to or open add staff form
    toast({
      title: "Feature coming soon",
      description: "Adding new staff members will be available in the next update.",
      variant: "default"
    });
  };

  const handleEditSuccess = () => {
    toast({
      title: "Success",
      description: "Staff member updated successfully",
      variant: "default"
    });
  };

  const handleDeleteSuccess = () => {
    toast({
      title: "Success",
      description: "Staff member removed successfully",
      variant: "default"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button className="flex items-center gap-2" onClick={handleAddStaffClick}>
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
                {staffMembers?.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      {staff.first_name} {staff.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(staff.role)}>
                        {staff.custom_roles?.name || staff.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone_number}</TableCell>
                    <TableCell>
                      <Badge variant={staff.status === 'active' ? 'success' : 'secondary'}>
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(staff)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(staff)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {staffMembers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditStaffDialog 
        isOpen={isEditDialogOpen}
        staffMember={selectedMember}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <DeleteStaffDialog
        isOpen={isDeleteDialogOpen}
        staffMember={selectedMember}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
