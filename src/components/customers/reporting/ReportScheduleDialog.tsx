
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportSchedule } from './types';

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
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Schedule Report</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>

        <div className="flex justify-end space-x-2">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button onClick={handleSave}>Save Schedule</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
