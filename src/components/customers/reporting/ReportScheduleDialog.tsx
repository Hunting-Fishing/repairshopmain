
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ScheduleForm } from './components/ScheduleForm';
import { PreviewTab } from './ReportSchedule/components/PreviewTab';
import { DialogActions } from './ReportSchedule/components/DialogActions';
import { useScheduleValidation } from './ReportSchedule/hooks/useScheduleValidation';
import { useScheduleSubmit } from './ReportSchedule/hooks/useScheduleSubmit';
import type { ReportSchedule, ReportProcessingQueueItem, RealtimePostgresChangesPayload } from './types';

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
  const { errors, setErrors, validateSchedule } = useScheduleValidation();
  const { toast } = useToast();
  const { handleSave, handleSubmitForApproval } = useScheduleSubmit(templateId, onSchedule);

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
              description: `Status: ${payload.new.status}`
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
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return;
    }

    setSchedule({
      ...schedule,
      recipients: [...(schedule.recipients || []), { email, type: recipientType }]
    });
    setEmail('');
    setErrors(prev => {
      const { recipients, ...rest } = prev;
      return rest;
    });
  };

  const handleScheduleSave = async () => {
    if (!validateSchedule(schedule)) {
      toast({
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    await handleSave(schedule);
  };

  const handleScheduleSubmit = async () => {
    if (!validateSchedule(schedule)) {
      toast({
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    await handleSubmitForApproval(schedule);
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
              errors={errors}
            />
          </TabsContent>

          <TabsContent value="preview">
            <PreviewTab template={template} previewData={previewData} />
          </TabsContent>
        </Tabs>

        <DialogActions
          onSave={handleScheduleSave}
          onSubmitForApproval={handleScheduleSubmit}
          isValid={Object.keys(errors).length === 0}
        />
      </DialogContent>
    </Dialog>
  );
}
