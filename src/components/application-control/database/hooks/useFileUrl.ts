
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFileUrl(bucketName: string, fileName: string) {
  return useQuery({
    queryKey: ['file-url', bucketName, fileName],
    queryFn: async () => {
      const { data } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600); // 1 hour expiry
      
      return data?.signedUrl;
    },
  });
}

