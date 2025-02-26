
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormValues } from '../types/customerTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';

export const useCustomerAutosave = (
  form: UseFormReturn<CustomerFormValues>,
  customerId: string,
  isEditMode: boolean = false
) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveData = async (data: Partial<CustomerFormValues>) => {
    try {
      setIsSaving(true);
      
      // Only validate customer_type as required
      if (!data.customer_type) {
        toast({
          title: "Validation Error",
          description: "Customer Type is required",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('customers')
        .upsert({
          id: customerId,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsDirty(false);
      console.log('Autosaved successfully:', data);
      return true;
    } catch (error: any) {
      console.error('Autosave error:', error);
      toast({
        title: "Autosave Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced save function
  const debouncedSave = debounce(saveData, 1000);

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(async (value, { name, type }) => {
      // Don't autosave if it's just being mounted
      if (type === 'all') return;
      
      console.log('Field changed:', { name, value });
      setIsDirty(true);

      // Get current form data
      const formData = form.getValues();

      // Only validate and save if we have a customer type
      if (formData.customer_type) {
        await debouncedSave(formData);
      }
    });

    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    };
  }, [form, customerId]);

  // Save data on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      if (isDirty) {
        const formData = form.getValues();
        if (formData.customer_type) {
          saveData(formData);
        }
      }
    };
  }, [isDirty]);

  const discardChanges = () => {
    setIsDirty(false);
    form.reset();
  };

  return {
    isDirty,
    isSaving,
    discardChanges
  };
};
