
import { useState, useMemo } from "react";
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
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  MoreVertical, 
  Download, 
  BarChart,
  Table2, 
  Eye,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Mail
} from "lucide-react";
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
import { StaffMetrics } from "./StaffMetrics";
import { AdvancedFilters, StaffFilters } from "./AdvancedFilters";
import { RoleDistributionChart } from "./RoleDistributionChart";
import { StatusDistributionChart } from "./StatusDistributionChart";
import { format } from "date-fns";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export function StaffList() {
  const { data: staffMembers, isLoading, error } = useStaffMembers();
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "analytics">("table");
  const [filters, setFilters] = useState<StaffFilters>({
    searchFields: ['name', 'email', 'phone']
  });
  
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
    
    const headers = ["Name", "Role", "Email", "Phone", "Status", "Hire Date"];
    const csvContent = [
      headers.join(","),
      ...filteredStaffMembers.map(staff => [
        `${staff.first_name} ${staff.last_name}`,
        staff.custom_roles?.name || staff.role,
        staff.email,
        staff.phone_number || "",
        staff.status || "",
        staff.hire_date || ""
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

  // Extract unique roles and statuses for filters
  const uniqueRoles = useMemo(() => [
    ...new Set(staffMembers?.map(staff => staff.role) || [])
  ], [staffMembers]);
  
  const uniqueStatuses = useMemo(() => [
    ...new Set(staffMembers?.map(staff => staff.status) || [])
  ], [staffMembers]);

  // Filter staff members based on search query and filters
  const filteredStaffMembers = useMemo(() => {
    return staffMembers?.filter(staff => {
      // Search query filtering
      let matchesSearch = true;
      if (searchQuery) {
        matchesSearch = false;
        const query = searchQuery.toLowerCase();
        
        if (filters.searchFields?.includes('name') && 
            `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(query)) {
          matchesSearch = true;
        }
        
        if (filters.searchFields?.includes('email') && 
            staff.email?.toLowerCase().includes(query)) {
          matchesSearch = true;
        }
        
        if (filters.searchFields?.includes('phone') && 
            staff.phone_number?.toLowerCase().includes(query)) {
          matchesSearch = true;
        }
        
        if (filters.searchFields?.includes('notes') && 
            staff.notes?.toLowerCase().includes(query)) {
          matchesSearch = true;
        }
      }
      
      // Role filtering
      const matchesRoleFilter = !filters.role || staff.role === filters.role;
      
      // Status filtering
      const matchesStatusFilter = !filters.status || staff.status === filters.status;
      
      // Hire date filtering
      let matchesHireDateFilter = true;
      if (filters.hireDate) {
        if (filters.hireDate.after && staff.hire_date) {
          matchesHireDateFilter = matchesHireDateFilter && 
            new Date(staff.hire_date) >= new Date(filters.hireDate.after);
        }
        
        if (filters.hireDate.before && staff.hire_date) {
          matchesHireDateFilter = matchesHireDateFilter && 
            new Date(staff.hire_date) <= new Date(filters.hireDate.before);
        }
        
        // If hire date filter is active but staff has no hire date, exclude them
        if ((filters.hireDate.after || filters.hireDate.before) && !staff.hire_date) {
          matchesHireDateFilter = false;
        }
      }
      
      // Specialties filtering
      let matchesSpecialtiesFilter = true;
      if (filters.hasSpecialties === true) {
        matchesSpecialtiesFilter = Array.isArray(staff.skills) && staff.skills.length > 0;
      }
      
      return matchesSearch && 
             matchesRoleFilter && 
             matchesStatusFilter && 
             matchesHireDateFilter &&
             matchesSpecialtiesFilter;
    }) || [];
  }, [staffMembers, searchQuery, filters]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Staff Management</h2>
        <Button className="flex items-center gap-2" onClick={handleAddStaffClick}>
          <UserPlus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      <Tabs defaultValue="table" onValueChange={(value) => setViewMode(value as "table" | "analytics")}>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
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
            <TabsList>
              <TabsTrigger value="table" className="flex items-center gap-1">
                <Table2 className="h-4 w-4" />
                <span>Table</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            <AdvancedFilters 
              filters={filters}
              onFiltersChange={setFilters}
              availableRoles={uniqueRoles}
              availableStatuses={uniqueStatuses}
            />

            <Button variant="outline" size="sm" onClick={exportStaffList}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <StaffMetrics staffMembers={filteredStaffMembers} />

        <TabsContent value="table" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Staff ({filteredStaffMembers.length})</CardTitle>
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
                        <TableHead>Hire Date</TableHead>
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
                          <TableCell>
                            {staff.email ? (
                              <a href={`mailto:${staff.email}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                <Mail className="h-3 w-3" />
                                {staff.email}
                              </a>
                            ) : "-"}
                          </TableCell>
                          <TableCell>{staff.phone_number || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={staff.status === 'active' ? 'success' : 'secondary'}>
                              {staff.status === 'active' ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {staff.status || "Inactive"}
                                </span>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {staff.hire_date ? format(new Date(staff.hire_date), 'MMM d, yyyy') : "-"}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditClick(staff)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
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
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <RoleDistributionChart staffMembers={filteredStaffMembers} />
            <StatusDistributionChart staffMembers={filteredStaffMembers} />
          </div>
        </TabsContent>
      </Tabs>

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
