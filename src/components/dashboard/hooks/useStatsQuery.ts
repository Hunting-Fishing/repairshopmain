
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StatData {
  id: string;
  type: string;
  value: number;
  trend: number;
  trend_direction: boolean;
  created_at: string;
  updated_at: string;
}

export function useStatsQuery() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Failed to fetch statistics');
        throw error;
      }

      console.log('Fetched stats:', data);
      return data as StatData[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
