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
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: Math.random().toString(36).slice(-8),
        email_confirm: true,
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          organization_id: organizationId,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          custom_role_id: data.role === "custom" ? data.customRoleId : null,
          phone_number: data.phoneNumber,
          hire_date: data.hireDate ? data.hireDate.toISOString().split('T')[0] : null,
          notes: data.notes,
          schedule: data.schedule,
          status: 'active',
        });

      if (profileError) throw profileError;

      // Add organization membership
      const { error: membershipError } = await supabase
        .from("organization_members")
        .insert({
          organization_id: organizationId,
          user_id: authData.user.id,
          status: 'active'
        });

      if (membershipError) throw membershipError;

      toast.success("Staff member added successfully");
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      return true;
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast.error("Failed to add staff member");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { addStaffMember, isLoading };
}