
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { JobTemplate, TemplateCategory } from "@/types/job-templates";

export function useJobTemplates() {
  return useQuery({
    queryKey: ['job-templates'],
    queryFn: async () => {
      console.log('Fetching job templates...');
      
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        console.log('No authenticated user found');
        throw new Error('You must be logged in to view templates');
      }

      // Get the user's organization_id from their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error('Error loading templates');
        throw new Error('Failed to load user profile');
      }

      const organizationId = profile?.organization_id || null;
      console.log('User organization_id:', organizationId);

      // Fetch templates with related data
      const { data, error } = await supabase
        .from('job_templates')
        .select(`
          *,
          template_vehicle_compatibility (
            id, make, model, year_start, year_end
          ),
          template_feedback (
            id, rating, comments,
            technician:profiles (first_name, last_name)
          ),
          template_usage_stats (
            use_count, avg_completion_time, success_rate
          )
        `)
        .eq('is_active', true)
        .or(`organization_id.is.null,organization_id.eq.${organizationId || '00000000-0000-0000-0000-000000000000'}`)
        .order('name');
      
      if (error) {
        console.error('Error fetching job templates:', error);
        toast.error('Error loading templates');
        throw new Error('Failed to load templates');
      }

      // Transform the data to match our type
      const templates = data.map((template: any): JobTemplate => ({
        ...template,
        compatibility: template.template_vehicle_compatibility,
        feedback: template.template_feedback,
        usage_stats: template.template_usage_stats?.[0] || {
          use_count: 0,
          avg_completion_time: null,
          success_rate: null
        }
      }));

      console.log('Templates fetched:', templates);
      
      return templates;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}

export function useTemplateCategories() {
  return useQuery({
    queryKey: ['template-categories'],
    queryFn: async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          throw new Error('You must be logged in to view template categories');
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.user.id)
          .maybeSingle();

        const organizationId = profile?.organization_id || null;

        const { data, error } = await supabase
          .from('template_categories')
          .select('*')
          .or(`organization_id.is.null,organization_id.eq.${organizationId || '00000000-0000-0000-0000-000000000000'}`)
          .order('name');

        if (error) {
          toast.error('Error loading template categories');
          throw new Error('Failed to load template categories');
        }

        return data as TemplateCategory[];
      } catch (err) {
        console.error('Error in useTemplateCategories:', err);
        return [];
      }
    }
  });
}
