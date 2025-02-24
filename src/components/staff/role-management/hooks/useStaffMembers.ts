
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "../types";

export function useStaffMembers() {
  return useQuery({
    queryKey: ["staff-members"],
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
        .from("profiles")
        .select("id, first_name, last_name, role, custom_role_id")
        .eq('organization_id', profileData.organization_id)
        .order("role");
      
      if (error) throw error;
      return data as StaffMember[];
    },
  });
}
