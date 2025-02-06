
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useFileUrl(bucketName: string, fileName: string) {
  return useQuery({
    queryKey: ['file-url', bucketName, fileName],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600); // 1 hour expiry
      
      if (error) {
        if (error.message.includes('Object not found')) {
          toast.error(`File "${fileName}" not found in bucket "${bucketName}"`);
        } else {
          toast.error(`Error accessing file: ${error.message}`);
        }
        return null;
      }
      
      return data?.signedUrl;
    },
  });
}

