
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TagAssignment } from "../types";

interface TagResponse {
  tag: {
    id: string;
    name: string;
    color: string | null;
    description: string | null;
  }
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

      return data.map((row: TagResponse) => ({
        tag: {
          id: row.tag.id,
          name: row.tag.name,
          color: row.tag.color,
          description: row.tag.description
        }
      }));
    },
  });
}
