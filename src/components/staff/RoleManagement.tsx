import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { StaffMemberRow } from "./role-management/StaffMemberRow";
import { CustomRoleDialog } from "./role-management/CustomRoleDialog";
import type { StaffMember, CustomRole } from "./role-management/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RoleManagement() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: staffMembers, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role, custom_role_id")
        .eq('organization_id', session.user.id)
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

      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .eq('organization_id', session.user.id);
      
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

  // Calculate role counts
  const getRoleCounts = () => {
    if (!staffMembers) return [];
    
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

  const roleCounts = getRoleCounts();
  const totalStaff = staffMembers?.length || 0;

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
          {/* Role Summary Table */}
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

          {/* Staff Members List */}
          {!staffMembers?.length ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No staff members found</p>
            </div>
          ) : (
            staffMembers.map((member) => (
              <StaffMemberRow
                key={member.id}
                member={member}
                customRoles={customRoles || []}
                isEditing={editingId === member.id}
                onEdit={() => setEditingId(member.id)}
                onCancelEdit={() => setEditingId(null)}
                onRoleChange={(newRole, customRoleId) => {
                  updateRole.mutate({ userId: member.id, newRole, customRoleId });
                }}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}