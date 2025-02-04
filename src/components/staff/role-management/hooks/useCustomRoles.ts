import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CustomRole } from "../types";

export function useCustomRoles() {
  return useQuery({
    queryKey: ["custom-roles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .eq('organization_id', profileData.organization_id);
      
      if (error) throw error;
      return data as CustomRole[];
    },
  });
}