
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

type CustomRole = {
  id: string;
  name: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
};

export function useOrganizationRoles() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: userProfile } = useProfile(user?.id);
  const organizationId = userProfile?.organization_id;

  // Fetch all custom roles in the organization
  const { 
    data: roles = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["organization-roles", organizationId],
    queryFn: async () => {
      if (!organizationId) {
        console.log("useOrganizationRoles - No organization ID available");
        return [];
      }

      console.log("useOrganizationRoles - Fetching roles for organization:", organizationId);
      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .eq("organization_id", organizationId);

      if (error) {
        console.error("useOrganizationRoles - Error fetching roles:", error);
        throw error;
      }

      console.log("useOrganizationRoles - Found roles count:", data?.length || 0);
      return data as CustomRole[];
    },
    enabled: !!organizationId,
  });

  // Create a new role
  const createRole = useMutation({
    mutationFn: async (roleName: string) => {
      if (!organizationId) {
        throw new Error("No organization ID available");
      }

      const { data, error } = await supabase
        .from("custom_roles")
        .insert([
          {
            name: roleName,
            organization_id: organizationId
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Role Created",
        description: "The new role has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["organization-roles", organizationId] });
    },
    onError: (error) => {
      console.error("Failed to create role:", error);
      toast({
        title: "Error",
        description: "Failed to create the new role",
        variant: "destructive"
      });
    }
  });

  // Update an existing role
  const updateRole = useMutation({
    mutationFn: async ({ roleId, roleName }: { roleId: string; roleName: string }) => {
      const { data, error } = await supabase
        .from("custom_roles")
        .update({ name: roleName })
        .eq("id", roleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "The role has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["organization-roles", organizationId] });
    },
    onError: (error) => {
      console.error("Failed to update role:", error);
      toast({
        title: "Error",
        description: "Failed to update the role",
        variant: "destructive"
      });
    }
  });

  // Delete a role
  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from("custom_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
      return { id: roleId };
    },
    onSuccess: () => {
      toast({
        title: "Role Deleted",
        description: "The role has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["organization-roles", organizationId] });
      // Also invalidate staff members query as their roles may have changed
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
    onError: (error) => {
      console.error("Failed to delete role:", error);
      toast({
        title: "Error",
        description: "Failed to delete the role. It may be in use by staff members.",
        variant: "destructive"
      });
    }
  });

  // Assign role to staff member
  const assignRoleToStaff = useMutation({
    mutationFn: async ({ staffId, roleId }: { staffId: string; roleId: string }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ custom_role_id: roleId })
        .eq("id", staffId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Role Assigned",
        description: "The role has been assigned successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
    onError: (error) => {
      console.error("Failed to assign role:", error);
      toast({
        title: "Error",
        description: "Failed to assign the role to the staff member",
        variant: "destructive"
      });
    }
  });

  return {
    roles,
    isLoading,
    error,
    createRole: (name: string) => createRole.mutateAsync(name),
    updateRole: (roleId: string, name: string) => updateRole.mutateAsync({ roleId, roleName: name }),
    deleteRole: (roleId: string) => deleteRole.mutateAsync(roleId),
    assignRoleToStaff: (staffId: string, roleId: string) => assignRoleToStaff.mutateAsync({ staffId, roleId }),
    isCreating: createRole.isPending,
    isUpdating: updateRole.isPending,
    isDeleting: deleteRole.isPending,
    isAssigning: assignRoleToStaff.isPending
  };
}
