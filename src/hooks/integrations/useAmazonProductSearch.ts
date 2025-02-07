
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchParams {
  keywords: string;
  marketplace?: string;
}

export function useAmazonProductSearch() {
  const queryClient = useQueryClient();

  const searchProducts = useMutation({
    mutationFn: async ({ keywords, marketplace = 'US' }: SearchParams) => {
      const { data, error } = await supabase.functions.invoke('amazon-product-search', {
        body: { keywords, marketplace }
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error('Error searching products:', error);
      toast.error("Failed to search products");
    }
  });

  return {
    searchProducts,
  };
}
