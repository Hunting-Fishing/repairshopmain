
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface JobTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimated_hours: number | null;
  parts_required: any | null;
  is_active: boolean;
}

export function useJobTemplates() {
  return useQuery({
    queryKey: ['job-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('Error fetching job templates:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      return data as JobTemplate[];
    }
  });
}
