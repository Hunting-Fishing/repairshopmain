
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useBusinessTypes() {
  const { data: businessTypes } = useQuery({
    queryKey: ["businessTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return businessTypes;
}
