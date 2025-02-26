
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { JobTemplate, TemplateCategory } from "@/types/job-templates";

export function useJobTemplates() {
  return useQuery({
    queryKey: ['job-templates'],
    queryFn: async () => {
      console.log('Fetching job templates...');
      
      try {
        // First check if user is authenticated
        const { data: user, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Authentication error:', authError);
          throw new Error(`Authentication failed: ${authError.message}`);
        }
        
        if (!user.user) {
          console.error('No authenticated user found');
          throw new Error('You must be logged in to view templates');
        }
        
        console.log('User authenticated:', user.user.id);

        // Get the user's organization_id from their profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw new Error(`Failed to load user profile: ${profileError.message}`);
        }

        if (!profile) {
          console.error('No profile found for user:', user.user.id);
          throw new Error('User profile not found');
        }

        const organizationId = profile.organization_id || null;
        console.log('User organization_id:', organizationId);

        // Fetch templates - MODIFIED to remove problematic joins
        let query = supabase
          .from('job_templates')
          .select(`
            *,
            template_vehicle_compatibility (
              id, make, model, year_start, year_end
            ),
            template_usage_stats (
              use_count, avg_completion_time, success_rate
            )
          `)
          .eq('is_active', true);
        
        // Add organization filter if we have an organizationId
        if (organizationId) {
          query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
        } else {
          query = query.or('organization_id.is.null');
        }
        
        // Execute the query
        const { data, error } = await query.order('name');
        
        if (error) {
          console.error('Error fetching job templates:', error);
          throw new Error(`Failed to load templates: ${error.message}`);
        }

        console.log('Templates data received:', data ? data.length : 0);

        if (!data || data.length === 0) {
          console.log('No templates found');
          return [];
        }

        // Try to fetch feedback separately if possible
        let feedbackByTemplateId: Record<string, any[]> = {};
        try {
          const { data: feedbackData, error: feedbackError } = await supabase
            .from('template_feedback')
            .select('id, template_id, rating, comments');
          
          if (!feedbackError && feedbackData) {
            // Group feedback by template_id
            feedbackByTemplateId = feedbackData.reduce((acc, item) => {
              if (!acc[item.template_id]) {
                acc[item.template_id] = [];
              }
              acc[item.template_id].push(item);
              return acc;
            }, {} as Record<string, any[]>);
          }
        } catch (feedbackErr) {
          console.warn('Could not fetch template feedback:', feedbackErr);
          // Continue without feedback data
        }

        // Transform the data to match our type
        const templates = data.map((template: any): JobTemplate => {
          try {
            return {
              ...template,
              compatibility: template.template_vehicle_compatibility || [],
              feedback: feedbackByTemplateId[template.id] || [],
              usage_stats: template.template_usage_stats?.[0] || {
                use_count: 0,
                avg_completion_time: null,
                success_rate: null
              }
            };
          } catch (err) {
            console.error('Error transforming template:', template.id, err);
            // Return a minimal valid template if there's an error
            return {
              ...template,
              compatibility: [],
              feedback: [],
              usage_stats: {
                use_count: 0,
                avg_completion_time: null,
                success_rate: null
              }
            };
          }
        });

        console.log('Templates processed successfully:', templates.length);
        return templates;
      } catch (error: any) {
        console.error('Error in job templates query:', error);
        toast.error(`Error loading templates: ${error.message || 'Unknown error'}`);
        throw error;
      }
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
        const { data: user, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Authentication error:', authError);
          throw new Error(`Authentication failed: ${authError.message}`);
        }
        
        if (!user.user) {
          console.error('No authenticated user found');
          throw new Error('You must be logged in to view template categories');
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return [];
        }

        const organizationId = profile?.organization_id || null;
        console.log('Categories query - user organization_id:', organizationId);

        // Build the query with proper organization filtering
        let query = supabase
          .from('template_categories')
          .select('*');
          
        if (organizationId) {
          query = query.or(`organization_id.is.null,organization_id.eq.${organizationId}`);
        } else {
          query = query.or('organization_id.is.null');
        }
        
        const { data, error } = await query.order('name');

        if (error) {
          console.error('Error fetching template categories:', error);
          toast.error('Error loading template categories');
          return [];
        }

        console.log('Categories found:', data?.length || 0);
        return data as TemplateCategory[];
      } catch (err: any) {
        console.error('Error in useTemplateCategories:', err);
        toast.error(`Error loading categories: ${err.message || 'Unknown error'}`);
        return [];
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });
}
