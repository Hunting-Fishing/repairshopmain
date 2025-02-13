
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportSchedule } from '../types';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ScheduleFormProps {
  schedule: Partial<ReportSchedule>;
  email: string;
  recipientType: 'to' | 'cc' | 'bcc';
  onEmailChange: (email: string) => void;
  onRecipientTypeChange: (type: 'to' | 'cc' | 'bcc') => void;
  onScheduleChange: (schedule: Partial<ReportSchedule>) => void;
  onAddRecipient: () => void;
  errors: Record<string, string>;
}

export function ScheduleForm({
  schedule,
  email,
  recipientType,
  onEmailChange,
  onRecipientTypeChange,
  onScheduleChange,
  onAddRecipient,
  errors
}: ScheduleFormProps) {
  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Schedule Name</FormLabel>
        <Input
          placeholder="Schedule Name"
          value={schedule.name || ''}
          onChange={(e) => onScheduleChange({ ...schedule, name: e.target.value })}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <FormMessage className="text-destructive">{errors.name}</FormMessage>}
      </FormItem>
      
      <FormItem>
        <FormLabel>Frequency</FormLabel>
        <Select
          value={schedule.frequency}
          onValueChange={(value) => 
            onScheduleChange({ 
              ...schedule, 
              frequency: value as 'daily' | 'weekly' | 'monthly'
            })
          }
        >
          <SelectTrigger className={errors.frequency ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        {errors.frequency && <FormMessage className="text-destructive">{errors.frequency}</FormMessage>}
      </FormItem>

      <div className="space-y-2">
        <FormItem>
          <FormLabel>Recipients</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Recipient Email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
            />
            <Select
              value={recipientType}
              onValueChange={(value) => onRecipientTypeChange(value as 'to' | 'cc' | 'bcc')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to">To</SelectItem>
                <SelectItem value="cc">CC</SelectItem>
                <SelectItem value="bcc">BCC</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onAddRecipient}>Add</Button>
          </div>
          {errors.email && <FormMessage className="text-destructive">{errors.email}</FormMessage>}
          {errors.recipients && <FormMessage className="text-destructive">{errors.recipients}</FormMessage>}
        </FormItem>

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
