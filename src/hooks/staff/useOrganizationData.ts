import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CustomRole } from "@/components/staff/role-management/types";

export function useOrganizationData() {
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
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