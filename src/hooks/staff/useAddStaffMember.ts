
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { StaffMemberFormValues } from "@/components/staff/add-staff-member/schema";

type AddStaffMemberParams = StaffMemberFormValues & { organization_id: string };

export function useAddStaffMember() {
  const queryClient = useQueryClient();

  const { mutateAsync: addStaffMemberAsync, isPending } = useMutation({
    mutationFn: async (params: AddStaffMemberParams) => {
      // 1. First, create the auth user (this would typically be done by an Edge Function)
      // For now, we'll simulate by just adding to the profiles table
      
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          first_name: params.firstName,
          last_name: params.lastName,
          phone_number: params.phoneNumber,
          role: params.role === 'custom' ? 'custom' : params.role,
          custom_role_id: params.role === 'custom' ? params.customRoleId : null,
          status: 'active',
          organization_id: params.organization_id,
          hire_date: params.hireDate ? params.hireDate.toISOString().split('T')[0] : null,
          notes: params.notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      return true;
    },
  });

  return { 
    addStaffMember: (params: AddStaffMemberParams) => 
      addStaffMemberAsync(params),
    isLoading: isPending
  };
}
