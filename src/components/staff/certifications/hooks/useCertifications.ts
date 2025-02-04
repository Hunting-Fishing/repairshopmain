import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Certification {
  id: string;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  profile_id: string;
}

export function useCertifications(profileId?: string) {
  return useQuery({
    queryKey: ["staff-certifications", profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_certifications")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Certification[];
    },
    enabled: !!profileId,
  });
}