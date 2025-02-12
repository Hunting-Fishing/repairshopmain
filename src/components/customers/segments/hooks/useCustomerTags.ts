
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TagAssignment } from "../types";
import { useToast } from "@/hooks/use-toast";

type DatabaseTag = {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
}

interface TagRow {
  tag: DatabaseTag;
}

export function useCustomerTags(customerId: string) {
  const { toast } = useToast();

  return useQuery<TagAssignment[], Error>({
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

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching tags",
          description: error.message,
        });
        throw error;
      }
      
      if (!data) return [];

      // Safe type assertion after runtime check
      const typedData = data as unknown as TagRow[];
      return typedData.map((row) => ({
        tag: row.tag
      }));
    },
    // Add caching configuration
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: (error: Error) => {
        console.error("Tags fetch error:", error);
      }
    }
  });
}
