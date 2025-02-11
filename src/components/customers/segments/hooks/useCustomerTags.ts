
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TagAssignment } from "../types";

type DatabaseTag = {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
}

export function useCustomerTags(customerId: string) {
  return useQuery<TagAssignment[]>({
    queryKey: ["customer-tags", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_tag_assignments")
        .select(`
          tag:customer_tags (
            id,
            name,
            color,
            description
          )
        `)
        .eq("customer_id", customerId);

      if (error) throw error;
      
      if (!data) return [];

      return data.map((row) => ({
        tag: row.tag as DatabaseTag
      }));
    },
  });
}
