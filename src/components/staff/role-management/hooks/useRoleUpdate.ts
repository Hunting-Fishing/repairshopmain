
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { StaffMember } from "../types";

export function useRoleUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
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
    },
    onError: (error) => {
      toast.error("Failed to update role");
      console.error("Error updating role:", error);
    },
  });
}
