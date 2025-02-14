
import { useState } from 'react';

export function useScheduleValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSchedule = (schedule: any) => {
    const newErrors: Record<string, string> = {};

    if (!schedule.name?.trim()) {
      newErrors.name = 'Schedule name is required';
    }

    if (!schedule.frequency) {
      newErrors.frequency = 'Frequency is required';
    }

    if (!schedule.recipients || schedule.recipients.length === 0) {
      newErrors.recipients = 'At least one recipient is required';
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
