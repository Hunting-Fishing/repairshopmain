
import { useState } from 'react';
import type { ReportSchedule } from '../../types';

export function useScheduleValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSchedule = (schedule: Partial<ReportSchedule>) => {
    const newErrors: Record<string, string> = {};

    if (!schedule.name?.trim()) {
      newErrors.name = 'Schedule name is required';
    }

    if (!schedule.frequency) {
      newErrors.frequency = 'Frequency is required';
    }

    if (!schedule.recipients || schedule.recipients.length === 0) {
      newErrors.recipients = 'At least one recipient is required';
    } else {
      const invalidEmails = schedule.recipients.filter(r => 
        !r.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      );
      if (invalidEmails.length > 0) {
        newErrors.email = 'Invalid email address format';
      }
    }

    if (schedule.frequency === 'weekly' && !schedule.frequency_config?.dayOfWeek) {
      newErrors.dayOfWeek = 'Day of week is required for weekly schedules';
    }

    if (schedule.frequency === 'monthly' && !schedule.frequency_config?.dayOfMonth) {
      newErrors.dayOfMonth = 'Day of month is required for monthly schedules';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    errors,
    setErrors,
    validateSchedule
  };
}
