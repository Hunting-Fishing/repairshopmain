
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import { toast } from "@/components/ui/use-toast";

export function useUpdateStaffMember() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateStaffMemberAsync, isPending } = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<StaffMember> }) => {
      console.log("Updating staff member:", params.id, "with data:", params.updates);
      
      const updateData = {
        first_name: params.updates.first_name,
        last_name: params.updates.last_name,
        role: params.updates.role,
        phone_number: params.updates.phone_number,
        status: params.updates.status,
        custom_role_id: params.updates.custom_role_id,
        hire_date: params.updates.hire_date,
        skills: params.updates.skills,
        // Only include these fields if they exist in the updates
        ...(params.updates.emergency_contact ? { emergency_contact: params.updates.emergency_contact } : {}),
        ...(params.updates.preferred_working_hours ? { preferred_working_hours: params.updates.preferred_working_hours } : {}),
        ...(params.updates.notes ? { notes: params.updates.notes } : {})
      };
      
      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", params.id)
        .select();

      if (error) {
        console.error("Error updating staff member:", error);
        throw error;
      }
      
      console.log("Staff member updated successfully:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Staff Updated",
        description: "Staff member has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
    onError: (error) => {
      console.error("Error in update mutation:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update staff member information",
        variant: "destructive"
      });
    }
  });

  return { 
    updateStaffMember: (id: string, updates: Partial<StaffMember>) => 
      updateStaffMemberAsync({ id, updates }),
    isLoading: isPending
  };
}
