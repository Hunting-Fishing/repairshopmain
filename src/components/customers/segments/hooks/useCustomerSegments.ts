
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SegmentAssignment } from "../types";

export function useCustomerSegments(customerId: string) {
  return useQuery<SegmentAssignment[]>({
    queryKey: ["customer-segments", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_segment_assignments")
        .select(`
          segment:customer_segments (
            id,
            name,
            description,
            criteria
          )
        `)
        .eq("customer_id", customerId);

      if (error) throw error;
      
      return (data || []).map(item => ({
        segment: {
          id: item.segment.id,
          name: item.segment.name,
          description: item.segment.description,
          criteria: item.segment.criteria
        }
      }));
    },
  });
}
