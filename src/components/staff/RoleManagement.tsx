
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { roles } from "./role-management/types";

type Permission = {
  id: string;
  name: string;
  description: string;
  module: string;
}

type Role = {
  id: string;
  name: string;
  description?: string;
  isCustom: boolean;
  permissions: string[];
}

interface RoleManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleManagement({ isOpen, onClose }: RoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  
  // Mock data for demonstration
  const availablePermissions: Permission[] = [
    { id: "view-staff", name: "View Staff", description: "Can view staff list", module: "Staff" },
    { id: "edit-staff", name: "Edit Staff", description: "Can edit staff details", module: "Staff" },
    { id: "delete-staff", name: "Delete Staff", description: "Can remove staff members", module: "Staff" },
    { id: "view-customer", name: "View Customers", description: "Can view customer list", module: "Customers" },
    { id: "edit-customer", name: "Edit Customers", description: "Can edit customer details", module: "Customers" },
    { id: "view-inventory", name: "View Inventory", description: "Can view inventory", module: "Inventory" },
    { id: "edit-inventory", name: "Edit Inventory", description: "Can modify inventory", module: "Inventory" },
    { id: "view-calendar", name: "View Calendar", description: "Can access the calendar", module: "Calendar" },
    { id: "manage-bookings", name: "Manage Bookings", description: "Can add/edit bookings", module: "Calendar" },
  ];

  const allRoles: Role[] = [
    { 
      id: "owner", 
      name: "Owner", 
      description: "Full access to all features", 
      isCustom: false,
      permissions: availablePermissions.map(p => p.id)
    },
    { 
      id: "manager", 
      name: "Manager", 
      description: "Can manage most aspects of the system", 
      isCustom: false,
      permissions: ["view-staff", "edit-staff", "view-customer", "edit-customer", "view-inventory", "view-calendar", "manage-bookings"]
    },
    { 
      id: "service_advisor", 
      name: "Service Advisor", 
      description: "Customer-facing staff", 
      isCustom: false,
      permissions: ["view-staff", "view-customer", "edit-customer", "view-inventory", "view-calendar", "manage-bookings"]
    },
    { 
      id: "technician", 
      name: "Technician", 
      description: "Technical staff performing repairs", 
      isCustom: false,
      permissions: ["view-customer", "view-inventory", "view-calendar"]
    },
    { 
      id: "custom-1", 
      name: "Office Admin", 
      description: "Custom role for administrative tasks", 
      isCustom: true,
      permissions: ["view-staff", "view-customer", "edit-customer", "view-inventory", "view-calendar"]
    },
  ];

  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
  
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditedPermissions(role.permissions);
    setIsEditRoleDialogOpen(true);
  };
  
  const handleAddRole = () => {
    setIsAddRoleDialogOpen(true);
  };
  
  const handleSaveNewRole = () => {
    // Add logic to save the new role
    setIsAddRoleDialogOpen(false);
    setNewRoleName("");
    setNewRoleDescription("");
  };
  
  const handleSaveEditedRole = () => {
    // Add logic to save the edited role
    setIsEditRoleDialogOpen(false);
    setSelectedRole(null);
    setEditedPermissions([]);
  };
  
  const handleTogglePermission = (permissionId: string) => {
    setEditedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Role & Permission Management</DialogTitle>
          <DialogDescription>
            Manage roles and their associated permissions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Roles</h3>
            <Button size="sm" onClick={handleAddRole}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Role
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRoles.map(role => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <Badge variant={role.isCustom ? "outline" : "secondary"}>
                          {role.isCustom ? "Custom" : "System"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {role.permissions.length} permissions
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditRole(role)}
                          disabled={!role.isCustom && role.id === "owner"}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {role.isCustom && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Add Role Dialog */}
        <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>
                Create a new custom role with specific permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input 
                  id="role-name" 
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g., Office Manager"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Input 
                  id="role-description" 
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Describe the role's responsibilities"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveNewRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Role Dialog */}
        <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role: {selectedRole?.name}</DialogTitle>
              <DialogDescription>
                Modify role details and permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {selectedRole?.isCustom && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role-name">Role Name</Label>
                    <Input 
                      id="edit-role-name" 
                      value={selectedRole?.name}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-role-description">Description</Label>
                    <Input 
                      id="edit-role-description" 
                      value={selectedRole?.description}
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label className="text-base">Permissions</Label>
                <Card className="border-dashed">
                  <CardContent className="p-4 space-y-4">
                    {Object.entries(
                      availablePermissions.reduce<Record<string, Permission[]>>((acc, permission) => {
                        if (!acc[permission.module]) {
                          acc[permission.module] = [];
                        }
                        acc[permission.module].push(permission);
                        return acc;
                      }, {})
                    ).map(([module, permissions]) => (
                      <div key={module} className="space-y-2">
                        <h4 className="font-medium">{module}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {permissions.map(permission => (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <Checkbox 
                                id={permission.id}
                                checked={editedPermissions.includes(permission.id)}
                                onCheckedChange={() => handleTogglePermission(permission.id)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor={permission.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {permission.name}
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEditedRole}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
