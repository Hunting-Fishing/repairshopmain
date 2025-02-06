
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useStorageBuckets() {
  return useQuery({
    queryKey: ['storage-buckets'],
    queryFn: async () => {
      try {
        console.log('Fetching storage buckets...');
        const { data, error } = await supabase
          .storage
          .listBuckets();
        
        if (error) {
          console.error('Error fetching buckets:', error);
          throw error;
        }
        
        console.log('Raw buckets response:', data);
        console.log('User session:', await supabase.auth.getSession());
        return data || [];
      } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
      }
    },
  });
}
