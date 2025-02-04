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
          category:skill_categories (
            name
          )
        `);

      if (error) throw error;

      return data as Skill[];
    }
  });
}