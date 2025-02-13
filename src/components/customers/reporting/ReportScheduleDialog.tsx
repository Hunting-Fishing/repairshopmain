
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportSchedule, ReportProcessingQueueItem, RealtimePostgresChangesPayload } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ScheduleForm } from './components/ScheduleForm';
import { ReportPreview } from './components/ReportPreview';

interface ReportScheduleDialogProps {
  templateId: string;
  onSchedule: (schedule: Partial<ReportSchedule>) => void;
}

export function ReportScheduleDialog({ templateId, onSchedule }: ReportScheduleDialogProps) {
  const [schedule, setSchedule] = useState<Partial<ReportSchedule>>({
    templateId,
    frequency: 'weekly',
    recipients: []
  });

  const [email, setEmail] = useState('');
  const [recipientType, setRecipientType] = useState<'to' | 'cc' | 'bcc'>('to');
  const [activeTab, setActiveTab] = useState('schedule');
  const { toast } = useToast();

  const { data: template } = useQuery({
    queryKey: ['report-template', templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('report-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'report_processing_queue',
          filter: `template_id=eq.${templateId}`
        },
        (payload: RealtimePostgresChangesPayload<ReportProcessingQueueItem>) => {
          if (payload.new) {
            toast({
              title: 'Report Status Update',
              description: `Status: ${payload.new.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [templateId, toast]);

  const addRecipient = () => {
    if (email) {
      setSchedule({
        ...schedule,
        recipients: [...(schedule.recipients || []), { email, type: recipientType }]
      });
      setEmail('');
    }
  };

  const handleSave = async () => {
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
        status: 'pending_approval' // Set initial status to pending approval
      });

    if (!error) {
      onSchedule(schedule);
      toast({
        title: 'Schedule Created',
        description: 'Your report schedule has been submitted for approval.',
      });
    } else {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSubmitForApproval = async () => {
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
        description: 'Your report has been submitted for approval.',
      });
    } else {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const previewData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 300 },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Schedule Report</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <ScheduleForm
              schedule={schedule}
              email={email}
              recipientType={recipientType}
              onEmailChange={setEmail}
              onRecipientTypeChange={setRecipientType}
              onScheduleChange={setSchedule}
              onAddRecipient={addRecipient}
            />
          </TabsContent>

          <TabsContent value="preview">
            <ReportPreview template={template} previewData={previewData} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button onClick={handleSave}>Save as Draft</Button>
          <Button onClick={handleSubmitForApproval} variant="default">
            Submit for Approval
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
