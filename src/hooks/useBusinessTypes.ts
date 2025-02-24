
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BusinessType {
  id: string;
  name: string;
}

export function useBusinessTypes() {
  const { data: businessTypes, isLoading, error } = useQuery({
    queryKey: ["businessTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as BusinessType[];
    },
  });

  return { businessTypes, isLoading, error };
}
