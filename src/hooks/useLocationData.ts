import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLocationData(selectedCountry: string) {
  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: regions } = useQuery({
    queryKey: ["regions", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const { data, error } = await supabase
        .from("regions")
        .select("*")
        .eq("country_id", selectedCountry)
        .order("name");
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCountry,
  });

  return { countries, regions };
}