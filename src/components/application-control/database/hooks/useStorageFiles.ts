
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useStorageFiles(bucketId: string | null) {
  return useQuery({
    queryKey: ['storage-files', bucketId],
    queryFn: async () => {
      if (!bucketId) return null;
      
      const { data, error } = await supabase
        .storage
        .from(bucketId)
        .list();
      
      if (error) throw error;
      return data;
    },
    enabled: !!bucketId,
  });
}
