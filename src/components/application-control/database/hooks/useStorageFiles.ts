
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useStorageFiles(bucketId: string | null) {
  return useQuery({
    queryKey: ['storage-files', bucketId],
    queryFn: async () => {
      if (!bucketId) return null;
      
      console.log('Fetching files from bucket:', bucketId);
      
      const { data: session } = await supabase.auth.getSession();
      console.log('Current session:', session);
      
      const { data, error } = await supabase
        .storage
        .from(bucketId)
        .list();
      
      if (error) {
        console.error("Error fetching files:", error);
        throw error;
      }
      
      console.log('Files retrieved:', data);
      return data;
    },
    enabled: !!bucketId,
  });
}
