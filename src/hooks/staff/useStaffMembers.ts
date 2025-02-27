
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import { toast } from "@/components/ui/use-toast";

export function useStaffMembers() {
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      console.log("useStaffMembers - Fetching session");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("useStaffMembers - Session:", session);
      return session;
    },
  });

  return useQuery({
    queryKey: ["staff-members", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log("useStaffMembers - No active session found");
        return [];
      }

      console.log("useStaffMembers - Fetching staff for user:", session.user.id);
      
      try {
        // Get organization ID
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("useStaffMembers - Error fetching user profile:", profileError);
          toast({
            title: "Error",
            description: "Failed to fetch organization information",
            variant: "destructive"
          });
          return [];
        }

        if (!userProfile?.organization_id) {
          console.log("useStaffMembers - No organization ID found in user profile");
          toast({
            title: "No Organization Found",
            description: "Your account is not associated with any organization",
            variant: "destructive"
          });
          return [];
        }

        console.log("useStaffMembers - Found organization ID:", userProfile.organization_id);
        
        // Get all staff members in the organization
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
            custom_role_id,
            custom_roles (
              id,
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
          toast({
            title: "Error",
            description: "Failed to fetch staff members",
            variant: "destructive"
          });
          return [];
        }
        
        if (!profiles || profiles.length === 0) {
          console.log("useStaffMembers - No profiles found");
          return [];
        }

        console.log("useStaffMembers - Found profiles count:", profiles.length);

        // Get email addresses for staff members
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_organization_user_emails', {
            org_id: userProfile.organization_id
          });

        if (emailError) {
          console.error("useStaffMembers - Error fetching emails:", emailError);
          toast({
            title: "Error",
            description: "Failed to fetch staff email information",
            variant: "destructive"
          });
          return [];
        }

        console.log("useStaffMembers - Found email data count:", emailData?.length || 0);

        // Create complete staff member objects
        const staffMembers = profiles.map(profile => {
          const email = emailData?.find(e => e.user_id === profile.id)?.email || '';
          
          return {
            ...profile,
            email,
            organization_id: userProfile.organization_id,
            custom_roles: profile.custom_roles 
              ? { id: profile.custom_roles[0]?.id || null, name: profile.custom_roles[0]?.name || null } 
              : null
          } as StaffMember;
        });

        console.log("useStaffMembers - Processed staff members count:", staffMembers.length);
        return staffMembers;
        
      } catch (error) {
        console.error("useStaffMembers - Unexpected error:", error);
        toast({
          title: "Unexpected Error",
          description: "An error occurred while fetching staff data",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !sessionLoading && !!session?.user?.id,
    initialData: [],
  });
}
