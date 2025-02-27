
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import { useGetOrganizationUserEmails } from "./useGetOrganizationUserEmails";

export function useStaffMemberById(id: string | undefined, organizationId: string | undefined) {
  const { data: emailData = [] } = useGetOrganizationUserEmails({ 
    org_id: organizationId || '' 
  });
  
  return useQuery({
    queryKey: ["staff-member", id, organizationId],
    queryFn: async () => {
      if (!id || !organizationId) {
        console.log("useStaffMemberById - Missing required parameters", { id, organizationId });
        return null;
      }

      console.log("useStaffMemberById - Fetching staff member:", id);
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          role,
          phone_number,
          hire_date,
          status,
          custom_roles (
            name
          ),
          emergency_contact,
          preferred_working_hours,
          skills,
          certifications,
          notes
        `)
        .eq("id", id)
        .eq("organization_id", organizationId)
        .maybeSingle();

      if (error) {
        console.error("useStaffMemberById - Error:", error);
        return null;
      }

      if (!data) {
        console.log("useStaffMemberById - No data found");
        return null;
      }

      const email = emailData.find(e => e.user_id === id)?.email || '';
      
      return {
        ...data,
        email,
        organization_id: organizationId,
        custom_roles: data.custom_roles ? { name: data.custom_roles[0]?.name || null } : null
      } as StaffMember;
    },
    enabled: !!id && !!organizationId,
  });
}
