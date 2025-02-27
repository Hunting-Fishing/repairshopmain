
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";

export function useStaffMembers() {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      console.log("useStaffMembers - Fetching session");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("useStaffMembers - Session:", session);
      return session;
    },
  });

  return useQuery({
    queryKey: ["staff-members", session?.user.id],
    queryFn: async () => {
      if (!session) {
        console.log("useStaffMembers - No active session found");
        return [];
      }

      console.log("useStaffMembers - Fetching staff for user:", session.user.id);
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!userProfile?.organization_id) {
        console.log("useStaffMembers - No organization ID found in user profile");
        return [];
      }

      console.log("useStaffMembers - Found organization ID:", userProfile.organization_id);
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
          ),
          emergency_contact,
          preferred_working_hours,
          skills,
          certifications
        `)
        .eq("organization_id", userProfile.organization_id);

      if (profilesError) {
        console.error("useStaffMembers - Error fetching profiles:", profilesError);
        return [];
      }
      if (!profiles) {
        console.log("useStaffMembers - No profiles found");
        return [];
      }

      console.log("useStaffMembers - Found profiles count:", profiles.length);

      const { data: emailData, error: emailError } = await supabase
        .rpc('get_organization_user_emails', {
          org_id: userProfile.organization_id
        });

      if (emailError) {
        console.error("useStaffMembers - Error fetching emails:", emailError);
        return [];
      }
      if (!emailData) {
        console.log("useStaffMembers - No email data found");
        return [];
      }

      console.log("useStaffMembers - Found email data count:", emailData.length);

      const staffMembers = profiles.map(profile => {
        const email = emailData.find(e => e.user_id === profile.id)?.email || '';
        return {
          ...profile,
          email,
          organization_id: userProfile.organization_id,
          custom_roles: profile.custom_roles ? { name: profile.custom_roles[0]?.name || null } : null
        } as StaffMember;
      });

      console.log("useStaffMembers - Processed staff members count:", staffMembers.length);
      return staffMembers;
    },
    enabled: !!session?.user.id,
    initialData: [],
  });
}
