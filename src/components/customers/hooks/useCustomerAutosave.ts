
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../types/customerTypes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { logError } from '@/utils/error-handling';

export function useCustomerAutosave(
  form: UseFormReturn<CustomerFormValues>,
  customerId: string,
  enabled: boolean = true,
  autosaveDelay: number = 3000
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<CustomerFormValues>();
  const isDirtyRef = useRef(false);

  // Setup beforeunload handler for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((value) => {
      isDirtyRef.current = true;

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
          isDirtyRef.current = false;
          
          // Update cache
          queryClient.setQueryData(['customer', customerId], formValues);
          
          toast({
            title: "Changes saved",
            description: "Your changes have been automatically saved",
            variant: "default"
          });
        } catch (error: any) {
          console.error('Autosave error:', error);
          logError(error, {
            action_type: 'autosave',
            table_name: 'customers',
            level: 'error',
            metadata: {
              formValues,
              customerId
            }
          });
          toast({
            title: "Autosave failed",
            description: "Failed to save changes. Please try again.",
            variant: "destructive"
          });
        }
      }, autosaveDelay);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, customerId, enabled, toast, queryClient, autosaveDelay]);

  return {
    isDirty: () => isDirtyRef.current,
    discardChanges: () => {
      isDirtyRef.current = false;
      if (lastSavedRef.current) {
        form.reset(lastSavedRef.current);
      }
    }
  };
}
