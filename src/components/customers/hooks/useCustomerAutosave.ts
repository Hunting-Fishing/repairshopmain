
import { useEffect, useState, useCallback, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../types/customerTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import { CustomerValidationService } from '../services/customerValidationService';
import { CustomerDataService } from '../services/customerDataService';

interface AutosaveState {
  isDirty: boolean;
  isSaving: boolean;
}

export const useCustomerAutosave = (
  form: UseFormReturn<CustomerFormValues>,
  customerId: string,
  isEditMode: boolean = false
) => {
  const [state, setState] = useState<AutosaveState>({
    isDirty: false,
    isSaving: false
  });
  
  const { toast } = useToast();
  const previousSavePromise = useRef<Promise<any> | null>(null);

  const saveData = useCallback(async (data: Partial<CustomerFormValues>) => {
    try {
      setState(prev => ({ ...prev, isSaving: true }));
      
      CustomerValidationService.validateRequiredFields(data as CustomerFormValues);
      const dataToSave = await CustomerDataService.prepareDataForSave(data, customerId);

      // Wait for any previous save to complete
      if (previousSavePromise.current) {
        await previousSavePromise.current;
      }

      const savePromise = supabase
        .from('customers')
        .upsert(dataToSave)
        .then(({ error }) => {
          if (error) throw error;
          setState(prev => ({ ...prev, isDirty: false }));
          console.log('Autosaved successfully:', dataToSave);
          return true;
        });

      previousSavePromise.current = savePromise;
      return await savePromise;
    } catch (error: any) {
      console.error('Autosave error:', error);
      toast({
        title: "Autosave Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setState(prev => ({ ...prev, isSaving: false }));
      previousSavePromise.current = null;
    }
  }, [customerId, toast]);

  // Memoized debounced save function
  const debouncedSave = useCallback(
    debounce(saveData, 1000),
    [saveData]
  );

  // Form change subscription with cleanup
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (!name) return;
      
      console.log('Field changed:', { name, value });
      setState(prev => ({ ...prev, isDirty: true }));

      const formData = form.getValues();
      if (shouldTriggerSave(formData)) {
        debouncedSave(formData);
      }
    });

    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    };
  }, [form, debouncedSave]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (state.isDirty) {
        const formData = form.getValues();
        if (formData.customer_type) {
          saveData(formData);
        }
      }
    };
  }, [state.isDirty, form, saveData]);

  const shouldTriggerSave = useCallback((formData: Partial<CustomerFormValues>): boolean => {
    return !!(formData.customer_type && formData.first_name && formData.last_name);
  }, []);

  const discardChanges = useCallback(() => {
    setState(prev => ({ ...prev, isDirty: false }));
    form.reset();
  }, [form]);

  return {
    isDirty: state.isDirty,
    isSaving: state.isSaving,
    discardChanges
  };
};
