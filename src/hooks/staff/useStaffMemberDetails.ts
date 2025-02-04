import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";

export function useStaffMemberDetails(staffId: string | null) {
  return useQuery({
    queryKey: ["staff-member", staffId],
    queryFn: async () => {
      if (!staffId) throw new Error("Staff ID is required");

      const { data: profile } = await supabase
        .from("profiles")
        .select(`
          id,
          organization_id,
          first_name,
          last_name,
          role,
          phone_number,
          hire_date,
          status,
          notes,
          emergency_contact,
          preferred_working_hours,
          skills,
          certifications,
          custom_roles (
            name
          )
        `)
        .eq("id", staffId)
        .single();

      const { data: emailData } = await supabase
        .rpc('get_organization_user_emails', {
          org_id: profile?.organization_id
        });

      if (!profile || !emailData) {
        throw new Error("Staff member not found");
      }

      const staffMember = {
        ...profile,
        email: emailData.find(e => e.user_id === profile.id)?.email || '',
        custom_roles: profile.custom_roles ? { name: profile.custom_roles[0]?.name || null } : null
      };

      return staffMember as StaffMember;
    },
    enabled: !!staffId,
  });
}