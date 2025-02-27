
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";

export function useUpdateStaffMember() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateStaffMemberAsync, isPending } = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<StaffMember> }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: params.updates.first_name,
          last_name: params.updates.last_name,
          role: params.updates.role,
          phone_number: params.updates.phone_number,
          status: params.updates.status
        })
        .eq("id", params.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
  });

  return { 
    updateStaffMember: (id: string, updates: Partial<StaffMember>) => 
      updateStaffMemberAsync({ id, updates }),
    isLoading: isPending
  };
}
