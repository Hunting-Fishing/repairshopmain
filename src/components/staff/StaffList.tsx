
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
import { UserPlus, Edit, Trash2, Search, Filter, MoreVertical, Download } from "lucide-react";
import { getRoleBadgeColor } from "./role-management/types";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";
import { toast } from "@/hooks/use-toast";
import { DeleteStaffDialog } from "./DeleteStaffDialog";
import { EditStaffDialog } from "./EditStaffDialog";
import { AddStaffMemberDialog } from "./AddStaffMemberDialog";
import { StaffMember } from "@/types/staff";
import { Input } from "../ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function StaffList() {
  const { data: staffMembers, isLoading, error } = useStaffMembers();
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<{ role?: string, status?: string }>({});

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
    setIsAddDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Staff member added successfully",
      variant: "default"
    });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Staff member updated successfully",
      variant: "default"
    });
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Staff member removed successfully",
      variant: "default"
    });
  };

  const exportStaffList = () => {
    // Basic CSV export functionality
    if (!staffMembers || staffMembers.length === 0) return;
    
    const headers = ["Name", "Role", "Email", "Phone", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredStaffMembers.map(staff => [
        `${staff.first_name} ${staff.last_name}`,
        staff.custom_roles?.name || staff.role,
        staff.email,
        staff.phone_number || "",
        staff.status || ""
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "staff_list.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter staff members based on search query and filters
  const filteredStaffMembers = staffMembers?.filter(staff => {
    const matchesSearch = searchQuery === "" || 
      `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRoleFilter = !filter.role || staff.role === filter.role;
    const matchesStatusFilter = !filter.status || staff.status === filter.status;
    
    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  }) || [];

  // Extract unique roles and statuses for filters
  const uniqueRoles = [...new Set(staffMembers?.map(staff => staff.role) || [])];
  const uniqueStatuses = [...new Set(staffMembers?.map(staff => staff.status) || [])];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button className="flex items-center gap-2" onClick={handleAddStaffClick}>
          <UserPlus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter(f => ({ ...f, role: undefined }))}>
                All Roles
              </DropdownMenuItem>
              {uniqueRoles.map(role => (
                <DropdownMenuItem key={role} onClick={() => setFilter(f => ({ ...f, role }))}>
                  {role}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter(f => ({ ...f, status: undefined }))}>
                All Statuses
              </DropdownMenuItem>
              {uniqueStatuses.map(status => (
                <DropdownMenuItem key={status} onClick={() => setFilter(f => ({ ...f, status }))}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={exportStaffList}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
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
            <div className="overflow-x-auto">
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
                  {filteredStaffMembers.map((staff) => (
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View Performance</DropdownMenuItem>
                            <DropdownMenuItem>Assign Tasks</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteClick(staff)} className="text-destructive">
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStaffMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {staffMembers?.length === 0 
                          ? "No staff members found."
                          : "No matching staff members found."
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddStaffMemberDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

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
