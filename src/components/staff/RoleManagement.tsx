import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { CustomRoleDialog } from "./role-management/CustomRoleDialog";
import { RoleDistributionTable } from "./role-management/RoleDistributionTable";
import { StaffList } from "./role-management/StaffList";
import type { StaffMember, CustomRole } from "./role-management/types";

export function RoleManagement() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: staffMembers, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // First get the organization_id from organization_members
      const { data: memberData, error: memberError } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      if (memberError) throw memberError;

      // Then get all profiles in that organization
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role, custom_role_id")
        .eq('organization_id', memberData.organization_id)
        .order("role");
      
      if (error) throw error;
      return data as StaffMember[];
    },
  });

  const { data: customRoles } = useQuery({
    queryKey: ["custom-roles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // Get organization_id from membership
      const { data: memberData, error: memberError } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      if (memberError) throw memberError;

      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .eq('organization_id', memberData.organization_id);
      
      if (error) throw error;
      return data as CustomRole[];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ 
      userId, 
      newRole, 
      customRoleId 
    }: { 
      userId: string; 
      newRole: StaffMember["role"]; 
      customRoleId?: string 
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          role: newRole,
          custom_role_id: customRoleId 
        })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      toast.success("Role updated successfully");
      setEditingId(null);
    },
    onError: (error) => {
      toast.error("Failed to update role");
      console.error("Error updating role:", error);
    },
  });

  if (isLoadingStaff) {
    return (
      <Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Staff Roles
          <CustomRoleDialog />
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}