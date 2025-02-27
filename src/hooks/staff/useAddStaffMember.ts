
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";

export function useAddStaffMember() {
  const queryClient = useQueryClient();

  const { mutateAsync: addStaffMemberAsync, isPending } = useMutation({
    mutationFn: async (newStaffData: Partial<StaffMember>) => {
      // 1. First, create the auth user (this would typically be done by an Edge Function)
      // For now, we'll simulate by just adding to the profiles table
      
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          first_name: newStaffData.first_name,
          last_name: newStaffData.last_name,
          phone_number: newStaffData.phone_number,
          role: newStaffData.role,
          status: newStaffData.status || 'active',
          organization_id: newStaffData.organization_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
  });

  return { 
    addStaffMember: (staffData: Partial<StaffMember>) => 
      addStaffMemberAsync(staffData),
    isLoading: isPending
  };
}
