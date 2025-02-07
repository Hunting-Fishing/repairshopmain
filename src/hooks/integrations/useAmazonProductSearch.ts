
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchParams {
  keywords: string;
  marketplace?: string;
}

interface AsinSearchParams {
  asin: string;
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

  const searchProductByAsin = useMutation({
    mutationFn: async ({ asin, marketplace = 'US' }: AsinSearchParams) => {
      console.log('Searching by ASIN:', asin);
      const { data, error } = await supabase.functions.invoke('amazon-product-search', {
        body: { asin, marketplace }
      });

      if (error) throw error;
      
      if (data?.SearchResult?.Items?.[0]) {
        const item = data.SearchResult.Items[0];
        return {
          title: item.ItemInfo?.Title?.DisplayValue || '',
          description: item.ItemInfo?.Features?.[0] || '',
          image: item.Images?.Primary?.Large?.URL || item.Images?.Primary?.Medium?.URL,
          price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || '',
          url: item.DetailPageURL || '',
        };
      }
      return null;
    },
    onError: (error) => {
      console.error('Error searching product by ASIN:', error);
      toast.error("Failed to load product details");
    }
  });

  return {
    searchProducts,
    searchProductByAsin,
  };
}
