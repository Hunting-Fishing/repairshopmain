import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember, UserProfile, EmailData } from "./types";

export function useStaffMembers() {
  return useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      if (!userProfile?.organization_id) throw new Error("No organization found");

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          phone_number,
          role,
          hire_date,
          status,
          custom_roles (
            name
          )
        `)
        .eq("organization_id", userProfile.organization_id);

      if (error) throw error;

      const { data: emailData } = await supabase
        .rpc<EmailData[]>('get_organization_user_emails', { 
          org_id: userProfile.organization_id 
        });

      return profiles.map(profile => ({
        ...profile,
        email: emailData?.find((e) => e.user_id === profile.id)?.email || ''
      })) as StaffMember[];
    },
  });
}