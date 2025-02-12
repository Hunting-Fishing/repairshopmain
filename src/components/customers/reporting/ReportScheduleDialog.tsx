
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportSchedule, ReportProcessingQueueItem, RealtimePostgresChangesPayload } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartWidget } from './widgets/ChartWidget';
import { useToast } from '@/hooks/use-toast';

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

  // Get report template for preview
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

  // Subscribe to real-time status updates
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
        created_by: user.id
      });

    if (!error) {
      onSchedule(schedule);
      toast({
        title: 'Schedule Created',
        description: 'Your report has been scheduled successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Mock data for preview
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

          <TabsContent value="schedule" className="space-y-4">
            <Input
              placeholder="Schedule Name"
              value={schedule.name || ''}
              onChange={(e) => setSchedule({ ...schedule, name: e.target.value })}
            />
            
            <Select
              value={schedule.frequency}
              onValueChange={(value: string) => 
                setSchedule({ 
                  ...schedule, 
                  frequency: value as 'daily' | 'weekly' | 'monthly'
                })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Recipient Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Select
                  value={recipientType}
                  onValueChange={(value: string) => setRecipientType(value as 'to' | 'cc' | 'bcc')}
                >
                  <option value="to">To</option>
                  <option value="cc">CC</option>
                  <option value="bcc">BCC</option>
                </Select>
                <Button onClick={addRecipient}>Add</Button>
              </div>

              <div className="space-y-1">
                {schedule.recipients?.map((recipient, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{recipient.type}: {recipient.email}</span>
                    <Button
                      variant="destructive"
                      onClick={() => setSchedule({
                        ...schedule,
                        recipients: schedule.recipients?.filter((_, i) => i !== index)
                      })}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Preview</h3>
                {template?.type === 'chart' && (
                  <ChartWidget
                    widget={{
                      id: 'preview',
                      type: 'chart',
                      title: template.name || 'Preview',
                      config: template.config || {
                        chartType: 'bar',
                        xAxis: 'name',
                        yAxis: 'value'
                      },
                      position: { x: 0, y: 0, w: 12, h: 4 }
                    }}
                    data={previewData}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button onClick={handleSave}>Save Schedule</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
