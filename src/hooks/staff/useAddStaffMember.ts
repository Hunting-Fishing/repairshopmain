
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StaffMemberFormValues } from "@/components/staff/add-staff-member/schema";

export function useAddStaffMember() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const addStaffMember = async (data: StaffMemberFormValues, organizationId: string) => {
    setIsLoading(true);
    try {
      // Call the Edge Function to create the staff member
      const { data: response, error } = await supabase.functions.invoke('create-staff-member', {
        body: {
          email: data.email,
          userData: {
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            customRoleId: data.customRoleId,
            phoneNumber: data.phoneNumber,
            hireDate: data.hireDate,
            notes: data.notes,
            schedule: data.schedule
          },
          organizationId
        }
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      return { success: true, data: response };
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast.error("Failed to add staff member", {
        description: error.message || "Please try again"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { addStaffMember, isLoading };
}
