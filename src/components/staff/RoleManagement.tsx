import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { StaffMemberRow } from "./role-management/StaffMemberRow";
import type { StaffMember } from "./role-management/types";

export function RoleManagement() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role")
        .eq('organization_id', session.user.id)
        .order("role");
      
      if (error) throw error;
      return data as StaffMember[];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: StaffMember["role"] }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading staff members...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!staffMembers?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No staff members found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {staffMembers?.map((member) => (
            <StaffMemberRow
              key={member.id}
              member={member}
              isEditing={editingId === member.id}
              onEdit={() => setEditingId(member.id)}
              onCancelEdit={() => setEditingId(null)}
              onRoleChange={(newRole) => {
                updateRole.mutate({ userId: member.id, newRole });
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}