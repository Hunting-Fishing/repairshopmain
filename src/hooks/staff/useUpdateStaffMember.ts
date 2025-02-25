
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMemberData } from "@/components/staff/staff-details/types";

export type UpdateStaffMemberData = StaffMemberData;

export function useUpdateStaffMember() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateStaffMember = async (data: UpdateStaffMemberData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          notes: data.notes,
          emergency_contact: data.emergency_contact,
          skills: data.skills,
        })
        .eq("id", data.id);

      if (error) throw error;

      toast.success("Staff member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      queryClient.invalidateQueries({ queryKey: ["staff-member", data.id] });
      
      return true;
    } catch (error) {
      console.error("Error updating staff member:", error);
      toast.error(error.message || "Failed to update staff member");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStaffMember, isLoading };
}
