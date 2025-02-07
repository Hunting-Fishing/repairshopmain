
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface JobTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimated_hours: number | null;
  parts_required: any | null;
  is_active: boolean;
  organization_id: string | null;
}

export function useJobTemplates() {
  return useQuery({
    queryKey: ['job-templates'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Get the user's organization_id from their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error('Error loading templates');
        throw profileError;
      }

      const { data, error } = await supabase
        .from('job_templates')
        .select('*')
        .eq('is_active', true)
        .or(`organization_id.is.null,organization_id.eq.${profile.organization_id}`)
        .order('name');
      
      if (error) {
        console.error('Error fetching job templates:', error);
        toast.error('Error loading templates');
        throw error;
      }
      
      return (data || []) as JobTemplate[];
    }
  });
}
