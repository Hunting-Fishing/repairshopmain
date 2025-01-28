import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";

interface EmailData {
  user_id: string;
  email: string;
}

export function useStaffMembers() {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  return useQuery({
    queryKey: ["staff-members", session?.user.id],
    queryFn: async () => {
      if (!session) throw new Error("No session");

      // Get user's organization
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!userProfile?.organization_id) throw new Error("No organization found");

      // Get all profiles in the organization
      const { data: profiles, error: profilesError } = await supabase
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
          )
        `)
        .eq("organization_id", userProfile.organization_id);

      if (profilesError) throw profilesError;
      if (!profiles) return [];

      // Get emails for all users in the organization
      const { data: emailData, error: emailError } = await supabase
        .rpc<EmailData>('get_organization_user_emails', { 
          org_id: userProfile.organization_id 
        });

      if (emailError) throw emailError;
      if (!emailData) return [];

      // Combine profile and email data
      return profiles.map(profile => ({
        ...profile,
        email: emailData.find(e => e.user_id === profile.id)?.email || ''
      })) as StaffMember[];
    },
    enabled: !!session?.user.id,
  });
}