
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ReportSchedule } from '../../types';

export function useScheduleSubmit(templateId: string, onSchedule: (schedule: Partial<ReportSchedule>) => void) {
  const { toast } = useToast();

  const handleSave = async (schedule: Partial<ReportSchedule>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('report_schedules')
      .insert({
        template_id: templateId,
        name: schedule.name,
        frequency: schedule.frequency,
        recipients: schedule.recipients,
        created_by: user.id,
        status: 'pending_approval'
      });

    if (!error) {
      onSchedule(schedule);
      toast({
        title: 'Schedule Created',
        description: 'Your report schedule has been submitted for approval.'
      });
    } else {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleSubmitForApproval = async (schedule: Partial<ReportSchedule>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('report_schedules')
      .update({ status: 'pending_approval' })
      .eq('template_id', templateId)
      .eq('created_by', user.id);

    if (!error) {
      toast({
        title: 'Submitted for Approval',
        description: 'Your report has been submitted for approval.'
      });
    } else {
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
