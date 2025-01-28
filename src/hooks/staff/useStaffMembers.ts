import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import type { EmailData } from "@/types/email";
import type { ProfileWithCustomRole } from "@/types/profile";

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

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!userProfile?.organization_id) {
        throw new Error("No organization found");
      }

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

      const { data: emailData, error: emailError } = await supabase
        .rpc<EmailData[]>('get_organization_user_emails', {
          org_id: userProfile.organization_id
        });

      if (emailError) throw emailError;
      if (!emailData) return [];

      return (profiles as ProfileWithCustomRole[]).map(profile => ({
        ...profile,
        email: emailData.find(e => e.user_id === profile.id)?.email || '',
      })) as StaffMember[];
    },
    enabled: !!session?.user.id,
  });
}