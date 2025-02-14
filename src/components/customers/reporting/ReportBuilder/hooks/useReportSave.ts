
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ReportTemplate } from '../types/reportTypes';

export function useReportSave() {
  const [isLoading, setIsLoading] = useState(false);

  const saveTemplate = async (template: Partial<ReportTemplate>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('report_templates')
        .insert({
          ...template,
          created_by: (await supabase.auth.getUser()).data.user?.id
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
