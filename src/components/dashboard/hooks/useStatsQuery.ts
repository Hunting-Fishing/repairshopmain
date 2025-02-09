
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StatData {
  type: string;
  value: number;
  trend: number;
  trend_direction: boolean;
}

export function useStatsQuery() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*');
      
      if (error) {
        toast.error('Failed to fetch statistics');
        throw error;
      }
      return data as StatData[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
