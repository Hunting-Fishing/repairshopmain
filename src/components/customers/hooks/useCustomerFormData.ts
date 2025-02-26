
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../types/customerTypes';
import { logError } from '@/utils/error-handling';

export function useCustomerFormData(form: UseFormReturn<CustomerFormValues>) {
  const [formSnapshot, setFormSnapshot] = useState<CustomerFormValues | null>(null);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      try {
        console.group('Form Field Change');
        console.log('Changed field:', name);
        console.log('Change type:', type);
        console.log('New value:', value);
        console.log('Current errors:', form.formState.errors);
        console.groupEnd();

        // Take form snapshots for comparison
        setFormSnapshot(value as CustomerFormValues);

        // Track validation issues
        const currentErrors = form.formState.errors;
        const errorMessages = Object.entries(currentErrors).map(([field, error]) => 
          `${field}: ${error.message}`
        );
        
        if (errorMessages.length > 0) {
          setValidationIssues(errorMessages);
          logError(new Error('Form validation issues'), {
            action_type: 'form_validation',
            table_name: 'customers',
            level: 'warning',
            metadata: {
              errors: errorMessages,
              formData: value,
              fieldName: name
            }
          });
        }
      } catch (error) {
        console.error('Error in form monitoring:', error);
        logError(error as Error, {
          action_type: 'form_monitoring',
          table_name: 'customers',
          level: 'error'
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return {
    formSnapshot,
    validationIssues,
    hasValidationIssues: validationIssues.length > 0
  };
}
