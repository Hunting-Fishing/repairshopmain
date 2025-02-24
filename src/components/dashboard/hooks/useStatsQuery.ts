
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
      try {
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
      } catch (error: any) {
        // Log error to audit_logs table
        await supabase.from('audit_logs').insert({
          action_type: 'error',
          table_name: 'stats',
          error_message: error.message,
          level: 'error',
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}
