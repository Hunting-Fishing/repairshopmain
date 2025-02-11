
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SegmentAssignment } from "../types";

type DatabaseSegment = {
  id: string;
  name: string;
  description: string | null;
  criteria: any;
}

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
      
      if (!data) return [];

      return data.map((row) => ({
        segment: row.segment as DatabaseSegment
      }));
    },
  });
}
