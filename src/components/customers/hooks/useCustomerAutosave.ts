
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../types/customerTypes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useCustomerAutosave(
  form: UseFormReturn<CustomerFormValues>,
  customerId: string,
  enabled: boolean = true
) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<CustomerFormValues>();

  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((value) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        const formValues = form.getValues();
        
        // Don't save if values haven't changed
        if (JSON.stringify(formValues) === JSON.stringify(lastSavedRef.current)) {
          return;
        }

        try {
          const { error } = await supabase
            .from('customers')
            .update(formValues)
            .eq('id', customerId);

          if (error) throw error;

          lastSavedRef.current = formValues;
          
          toast({
            title: "Changes saved",
            description: "Your changes have been automatically saved",
            variant: "default"
          });
        } catch (error: any) {
          console.error('Autosave error:', error);
          toast({
            title: "Autosave failed",
            description: "Failed to save changes. Please try again.",
            variant: "destructive"
          });
        }
      }, 5000); // 5 second delay
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, customerId, enabled, toast]);
}
