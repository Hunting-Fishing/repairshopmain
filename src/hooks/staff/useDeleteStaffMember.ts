
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDeleteStaffMember() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteStaffMember } = useMutation({
    mutationFn: async (id: string) => {
      // In a real application, you might:
      // 1. Archive the staff member instead of hard delete
      // 2. Handle associations and constraints
      // 3. Handle permissions
      
      // This implementation sets the status to inactive rather than deleting
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: "inactive" })
        .eq("id", id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
  });

  return { deleteStaffMember };
}
