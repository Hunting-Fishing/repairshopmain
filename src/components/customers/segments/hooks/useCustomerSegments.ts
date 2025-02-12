
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SegmentAssignment } from "../types";
import { useToast } from "@/hooks/use-toast";

type DatabaseSegment = {
  id: string;
  name: string;
  description: string | null;
  criteria: any;
}

interface SegmentRow {
  segment: DatabaseSegment;
}

export function useCustomerSegments(customerId: string) {
  const { toast } = useToast();

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

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching segments",
          description: error.message,
        });
        throw error;
      }
      
      if (!data) return [];

      // Ensure we handle the response data correctly
      return (data as SegmentRow[]).map((row) => ({
        segment: row.segment
      }));
    },
    // Add caching configuration
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Show error in toast but don't break the UI
    meta: {
      onError: (error: Error) => {
        console.error("Segments fetch error:", error);
      }
    }
  });
}
