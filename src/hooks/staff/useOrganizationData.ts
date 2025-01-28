import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CustomRole } from "@/components/staff/role-management/types";

export function useOrganizationData() {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const { data: customRoles = [] } = useQuery({
    queryKey: ["custom-roles", userProfile?.organization_id],
    queryFn: async () => {
      if (!userProfile?.organization_id) return [];

      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .eq('organization_id', userProfile.organization_id);
      
      if (error) throw error;
      return data as CustomRole[];
    },
    enabled: !!userProfile?.organization_id,
  });

  return { userProfile, customRoles };
}