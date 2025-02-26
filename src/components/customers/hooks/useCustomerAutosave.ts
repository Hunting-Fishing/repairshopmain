
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

  const validateRequiredFields = (data: CustomerFormValues) => {
    const { customer_type } = data;
    
    // Common required fields for all customer types
    if (!data.first_name || !data.last_name) {
      throw new Error("First name and last name are required");
    }

    // Type-specific validation
    switch (customer_type) {
      case 'Business':
        if (!data.company_name) {
          throw new Error("Company name is required for business customers");
        }
        if (!data.business_classification_id) {
          throw new Error("Business classification is required for business customers");
        }
        break;

      case 'Fleet':
        if (!data.company_name) {
          throw new Error("Company name is required for fleet customers");
        }
        if (!data.fleet_details) {
          throw new Error("Fleet details are required for fleet customers");
        }
        break;

      case 'Personal':
        // Personal customers only need the common required fields
        break;

      default:
        throw new Error("Invalid customer type");
    }
  };

  const prepareDataForSave = async (data: Partial<CustomerFormValues>) => {
    const { customer_type } = data;
    if (!customer_type) {
      throw new Error("Customer type is required");
    }

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

    // Add type-specific fields
    switch (customer_type) {
      case 'Business':
        return {
          ...baseFields,
          company_name: data.company_name,
          business_classification_id: data.business_classification_id,
          fleet_details: null
        };

      case 'Fleet':
        return {
          ...baseFields,
          company_name: data.company_name,
          fleet_details: data.fleet_details,
          business_classification_id: null
        };

      case 'Personal':
        return {
          ...baseFields,
          company_name: null,
          business_classification_id: null,
          fleet_details: null
        };

      default:
        throw new Error("Invalid customer type");
    }
  };

  const saveData = async (data: Partial<CustomerFormValues>) => {
    try {
      setIsSaving(true);
      
      // Validate required fields based on customer type
      validateRequiredFields(data as CustomerFormValues);
      
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

      // Only validate and save if we have required fields
      if (formData.customer_type && formData.first_name && formData.last_name) {
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
