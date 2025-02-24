
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ReportTemplate } from '../types/reportTypes';

export function useReportSave() {
  const [isLoading, setIsLoading] = useState(false);

  const saveTemplate = async (template: Partial<ReportTemplate>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) throw new Error("Organization not found");

      const { error } = await supabase
        .from('report_templates')
        .insert({
          ...template,
          created_by: user.id,
          organization_id: profile.organization_id
        });

      if (error) throw error;
      
      toast.success("Report template saved successfully");
    } catch (error: any) {
      toast.error("Failed to save template", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveTemplate,
    isLoading
  };
}
