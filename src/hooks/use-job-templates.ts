
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface JobTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimated_hours: number | null;
  parts_required: any | null;
  is_active: boolean;
  organization_id: string | null;
  job_number: string | null;
  sub_tasks: any[] | null;
  timeline: Record<string, any> | null;
  status: JobStatus;
}

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
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error('Error loading templates');
        throw new Error('Failed to load user profile');
      }

      if (!profile?.organization_id) {
        console.log('No organization ID found for user');
        throw new Error('No organization found for your account');
      }

      console.log('User organization_id:', profile.organization_id);

      const { data, error } = await supabase
        .from('job_templates')
        .select('*')
        .eq('is_active', true)
        .or(`organization_id.is.null,organization_id.eq.${profile.organization_id}`)
        .order('name');
      
      if (error) {
        console.error('Error fetching job templates:', error);
        toast.error('Error loading templates');
        throw new Error('Failed to load templates');
      }

      console.log('Templates fetched:', data);
      
      return (data || []) as JobTemplate[];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
}
