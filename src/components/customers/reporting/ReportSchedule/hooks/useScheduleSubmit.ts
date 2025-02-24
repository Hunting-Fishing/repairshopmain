
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ReportSchedule } from '../../ReportBuilder/types/reportTypes';

export function useScheduleSubmit(templateId: string, onSchedule: (schedule: Partial<ReportSchedule>) => void) {
  const { toast } = useToast();

  const handleSave = async (schedule: Partial<ReportSchedule>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) throw new Error('Organization not found');

      const { error } = await supabase
        .from('report_schedules')
        .insert({
          ...schedule,
          template_id: templateId,
          created_by: user.id,
          organization_id: profile.organization_id,
          status: 'pending_approval'
        });

      if (error) throw error;

      onSchedule(schedule);
      toast({
        title: 'Schedule Created',
        description: 'Your report schedule has been submitted for approval.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('report_schedules')
        .update({ status: 'pending_approval' })
        .eq('template_id', templateId)
        .eq('created_by', user.id);

      if (error) throw error;

      toast({
        title: 'Submitted for Approval',
        description: 'Your report schedule has been submitted for approval.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return {
    handleSave,
    handleSubmitForApproval
  };
}
