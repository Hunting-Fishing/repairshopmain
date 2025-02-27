
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type StaffMemberFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  customRoleId?: string;
  hireDate?: Date;
  notes?: string;
  email?: string;
};

export function useAddStaffMember() {
  const queryClient = useQueryClient();

  const { mutateAsync: addStaffMemberAsync, isPending } = useMutation({
    mutationFn: async (params: StaffMemberFormValues & { organization_id: string }) => {
      // For an actual implementation, we'd need an Edge Function to create the auth user
      // Here we're just adding the profile record
      
      console.log("Adding new staff member:", params);

      const profileData = {
        first_name: params.firstName,
        last_name: params.lastName,
        phone_number: params.phoneNumber || null,
        role: params.role,
        custom_role_id: params.role === 'custom' ? params.customRoleId : null,
        status: 'active',
        organization_id: params.organization_id,
        hire_date: params.hireDate ? params.hireDate.toISOString().split('T')[0] : null,
        notes: params.notes || null
      };
      
      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select();

      if (error) {
        console.error("Error adding staff member:", error);
        throw error;
      }
      
      console.log("Staff member added successfully:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Staff Added",
        description: "New staff member has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
    onError: (error) => {
      console.error("Error in add mutation:", error);
      toast({
        title: "Add Failed",
        description: "Failed to add new staff member",
        variant: "destructive"
      });
    }
  });

  return { 
    addStaffMember: (params: StaffMemberFormValues & { organization_id: string }) => 
      addStaffMemberAsync(params),
    isLoading: isPending
  };
}

export type { StaffMemberFormValues };
