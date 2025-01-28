import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { DatabaseFunctions } from "@/types/database/functions";

export function useStaffMembers() {
  return useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Get user's organization
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;
      if (!userProfile?.organization_id) throw new Error("No organization found");

      // Get staff profiles
      const { data: profiles, error: staffError } = await supabase
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

      if (staffError) throw staffError;

      // Get staff emails
      const { data: emailData, error: emailError } = await supabase.rpc<
        DatabaseFunctions['get_organization_user_emails']['Returns'],
        DatabaseFunctions['get_organization_user_emails']['Args']
      >('get_organization_user_emails', {
        org_id: userProfile.organization_id
      });

      if (emailError) throw emailError;
      if (!emailData) return [];

      // Combine profile and email data
      return profiles.map(profile => ({
        ...profile,
        email: emailData.find((e) => e.user_id === profile.id)?.email || ''
      })) as StaffMember[];
    },
  });
}