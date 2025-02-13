
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ReportSchedule } from '../types';

interface ScheduleFormProps {
  schedule: Partial<ReportSchedule>;
  email: string;
  recipientType: 'to' | 'cc' | 'bcc';
  onEmailChange: (email: string) => void;
  onRecipientTypeChange: (type: 'to' | 'cc' | 'bcc') => void;
  onScheduleChange: (schedule: Partial<ReportSchedule>) => void;
  onAddRecipient: () => void;
}

export function ScheduleForm({
  schedule,
  email,
  recipientType,
  onEmailChange,
  onRecipientTypeChange,
  onScheduleChange,
  onAddRecipient
}: ScheduleFormProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Schedule Name"
        value={schedule.name || ''}
        onChange={(e) => onScheduleChange({ ...schedule, name: e.target.value })}
      />
      
      <Select
        value={schedule.frequency}
        onValueChange={(value: string) => 
          onScheduleChange({ 
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
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <Select
            value={recipientType}
            onValueChange={(value: string) => onRecipientTypeChange(value as 'to' | 'cc' | 'bcc')}
          >
            <option value="to">To</option>
            <option value="cc">CC</option>
            <option value="bcc">BCC</option>
          </Select>
          <Button onClick={onAddRecipient}>Add</Button>
        </div>

        <div className="space-y-1">
          {schedule.recipients?.map((recipient, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{recipient.type}: {recipient.email}</span>
              <Button
                variant="destructive"
                onClick={() => onScheduleChange({
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
  );
}
