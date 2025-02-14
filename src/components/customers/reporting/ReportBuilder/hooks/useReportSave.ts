
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ReportTemplate } from '../types/reportTypes';

export function useReportSave() {
  const queryClient = useQueryClient();

  const { mutate: saveTemplate, isPending: isLoading, error } = useMutation({
    mutationFn: async (template: Partial<ReportTemplate>) => {
      const { error } = await supabase
        .from('report_templates')
        .insert({
          ...template,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      toast("Template Saved", {
        description: "Report template has been saved successfully"
      });
    },
    onError: (error) => {
      toast("Error Saving Template", {
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    saveTemplate,
    isLoading,
    error
  };
}
