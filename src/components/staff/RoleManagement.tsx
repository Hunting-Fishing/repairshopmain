import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomRoleDialog } from "./role-management/CustomRoleDialog";
import { RoleDistributionTable } from "./role-management/RoleDistributionTable";
import { StaffList } from "./role-management/StaffList";
import { useStaffMembers } from "./role-management/hooks/useStaffMembers";
import { useCustomRoles } from "./role-management/hooks/useCustomRoles";
import { useRoleUpdate } from "./role-management/hooks/useRoleUpdate";

export function RoleManagement() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data: staffMembers, isLoading: isLoadingStaff } = useStaffMembers();
  const { data: customRoles } = useCustomRoles();
  const updateRole = useRoleUpdate();

  if (isLoadingStaff) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Staff Roles
            <CustomRoleDialog />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading staff members...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          Staff Roles
          <CustomRoleDialog />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <RoleDistributionTable 
            staffMembers={staffMembers || []} 
            customRoles={customRoles || []} 
          />
          <StaffList
            staffMembers={staffMembers || []}
            customRoles={customRoles || []}
            editingId={editingId}
            onEdit={setEditingId}
            onCancelEdit={() => setEditingId(null)}
            onRoleChange={(userId, newRole, customRoleId) => {
              updateRole.mutate({ userId, newRole, customRoleId });
              setEditingId(null);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}