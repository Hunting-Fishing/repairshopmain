import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Skill } from "@/components/staff/skills/types";

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          id,
          name,
          category:skill_categories!inner (
            name
          )
        `);

      if (error) throw error;

      // Transform the data to match our type
      const transformedData = data?.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category ? item.category[0] : undefined
      }));

      return transformedData as Skill[];
    }
  });
}