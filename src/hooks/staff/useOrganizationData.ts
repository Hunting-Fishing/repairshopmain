
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { CustomRole } from "@/components/staff/role-management/types";

export function useOrganizationData() {
  const { user } = useAuth();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      console.log("useOrganizationData - Fetching session");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("useOrganizationData - Session:", session);
      return session;
    },
  });

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) {
        console.log("useOrganizationData - No user ID available");
        return null;
      }

      console.log("useOrganizationData - Fetching profile for user:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id, role, custom_role_id")
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("useOrganizationData - Error fetching profile:", error);
        throw error;
      }

      console.log("useOrganizationData - Profile data:", data);
      return data;
    },
    enabled: !!session?.user.id,
  });

  const { data: organizationDetails, isLoading: orgDetailsLoading } = useQuery({
    queryKey: ["organization-details", userProfile?.organization_id],
    queryFn: async () => {
      if (!userProfile?.organization_id) {
        console.log("useOrganizationData - No organization ID for details");
        return null;
      }

      console.log("useOrganizationData - Fetching org details for:", userProfile.organization_id);
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq('id', userProfile.organization_id)
        .maybeSingle();
      
      if (error) {
        console.error("useOrganizationData - Error fetching org details:", error);
        throw error;
      }

      console.log("useOrganizationData - Organization details:", data);
      return data;
    },
    enabled: !!userProfile?.organization_id,
  });

  const { data: customRoles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["custom-roles", userProfile?.organization_id],
    queryFn: async () => {
      if (!userProfile?.organization_id) {
        console.log("useOrganizationData - No organization ID for custom roles");
        return [];
      }

      console.log("useOrganizationData - Fetching custom roles for org:", userProfile.organization_id);
      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .eq('organization_id', userProfile.organization_id);
      
      if (error) {
        console.error("useOrganizationData - Error fetching custom roles:", error);
        throw error;
      }

      console.log("useOrganizationData - Custom roles:", data);
      return data as CustomRole[];
    },
    enabled: !!userProfile?.organization_id,
  });

  const { data: staffCount, isLoading: staffCountLoading } = useQuery({
    queryKey: ["staff-count", userProfile?.organization_id],
    queryFn: async () => {
      if (!userProfile?.organization_id) return 0;
      
      const { count, error } = await supabase
        .from("profiles")
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', userProfile.organization_id);
      
      if (error) {
        console.error("useOrganizationData - Error fetching staff count:", error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!userProfile?.organization_id,
  });

  console.log("useOrganizationData - Final state:", {
    sessionLoading,
    profileLoading,
    orgDetailsLoading,
    rolesLoading,
    staffCountLoading,
    userProfile,
    organization: organizationDetails,
    customRoles: customRoles.length,
    staffCount
  });

  return { 
    userProfile, 
    organization: organizationDetails,
    customRoles,
    staffCount,
    isLoading: sessionLoading || profileLoading || orgDetailsLoading || rolesLoading || staffCountLoading,
    userRole: userProfile?.role || 'unknown',
    isOwner: userProfile?.role === 'owner',
    isManager: userProfile?.role === 'owner' || userProfile?.role === 'manager'
  };
}
