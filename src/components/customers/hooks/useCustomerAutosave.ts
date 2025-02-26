
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

  const prepareDataForSave = async (data: Partial<CustomerFormValues>) => {
    const { customer_type } = data;

    // Get current user's organization_id and id
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    const { data: profileData } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', userData.user.id)
      .single();

    if (!profileData) throw new Error("No profile found");

    // Base fields that are common to all customer types
    const baseFields = {
      id: customerId,
      organization_id: profileData.organization_id,
      customer_type,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone_number: data.phone_number,
      street_address: data.street_address,
      city: data.city,
      state_province: data.state_province,
      postal_code: data.postal_code,
      country: data.country,
      language_preference: data.language_preference,
      timezone: data.timezone,
      created_by: userData.user.id,
      updated_by: userData.user.id,
      updated_at: new Date().toISOString()
    };

    // Add type-specific fields and validation
    switch (customer_type) {
      case 'Business':
        if (!data.company_name) {
          throw new Error("Company name is required for business customers");
        }
        return {
          ...baseFields,
          company_name: data.company_name,
          business_classification_id: data.business_classification_id
        };

      case 'Fleet':
        if (!data.company_name) {
          throw new Error("Company name is required for fleet customers");
        }
        return {
          ...baseFields,
          company_name: data.company_name,
          fleet_details: data.fleet_details
        };

      case 'Personal':
        // Personal customers just use the base fields
        if (!data.first_name || !data.last_name) {
          throw new Error("First and last name are required for personal customers");
        }
        return baseFields;

      default:
        throw new Error("Invalid customer type");
    }
  };

  const saveData = async (data: Partial<CustomerFormValues>) => {
    try {
      setIsSaving(true);
      
      // Validate customer_type is required
      if (!data.customer_type) {
        toast({
          title: "Validation Error",
          description: "Customer Type is required",
          variant: "destructive",
        });
        return false;
      }

      const dataToSave = await prepareDataForSave(data);

      const { error } = await supabase
        .from('customers')
        .upsert(dataToSave);

      if (error) throw error;

      setIsDirty(false);
      console.log('Autosaved successfully:', dataToSave);
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
    const subscription = form.watch((value, { name, type }) => {
      // Skip initial form setup
      if (!name) return;
      
      console.log('Field changed:', { name, value });
      setIsDirty(true);

      // Get current form data
      const formData = form.getValues();

      // Only validate and save if we have a customer type
      if (formData.customer_type) {
        debouncedSave(formData);
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
