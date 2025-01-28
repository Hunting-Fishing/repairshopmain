import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";

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
      if (!profiles) return [];

      // Get staff emails
      const { data: emailData, error: emailError } = await supabase
        .rpc('get_organization_user_emails', { 
          org_id: userProfile.organization_id 
        });

      if (emailError) throw emailError;
      if (!emailData) return [];

      // Combine profile and email data
      return profiles.map(profile => ({
        ...profile,
        email: (emailData as Array<{ user_id: string; email: string }>)
          .find(e => e.user_id === profile.id)?.email || ''
      })) as StaffMember[];
    },
    enabled: !!session?.user.id,
  });
}