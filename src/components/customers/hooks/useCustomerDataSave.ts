
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CustomerFormValues } from "../types/customerTypes";
import { useToast } from "@/hooks/use-toast";

interface ProfileCompleteness {
  score: number;
  missingFields: string[];
  suggestions: string[];
}

export function useCustomerDataSave(customerId: string) {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Field-level update mutation
  const updateFieldMutation = useMutation({
    mutationFn: async ({ field, value }: { field: keyof CustomerFormValues; value: any }) => {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('customers')
        .update({ [field]: value })
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(['customer', customerId], (oldData: any) => ({
        ...oldData,
        [variables.field]: variables.value
      }));

      toast({
        title: "Field updated",
        description: `Successfully updated ${variables.field}`,
      });
    },
    onError: (error) => {
      console.error('Field update error:', error);
      toast({
        title: "Update failed",
        description: "Failed to update field. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });

  // Calculate profile completeness
  const calculateProfileCompleteness = (data: CustomerFormValues): ProfileCompleteness => {
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'phone_number',
      'customer_type'
    ];

    const optionalFields = [
      'street_address',
      'city',
      'state_province',
      'postal_code',
      'country',
      'company_name',
      'language_preference',
      'timezone'
    ];

    const missingRequired = requiredFields.filter(field => !data[field as keyof CustomerFormValues]);
    const missingOptional = optionalFields.filter(field => !data[field as keyof CustomerFormValues]);

    const requiredScore = ((requiredFields.length - missingRequired.length) / requiredFields.length) * 70;
    const optionalScore = ((optionalFields.length - missingOptional.length) / optionalFields.length) * 30;

    const totalScore = Math.round(requiredScore + optionalScore);

    return {
      score: totalScore,
      missingFields: [...missingRequired, ...missingOptional],
      suggestions: generateSuggestions(missingRequired, missingOptional)
    };
  };

  // Generate improvement suggestions
  const generateSuggestions = (missingRequired: string[], missingOptional: string[]): string[] => {
    const suggestions: string[] = [];

    if (missingRequired.length > 0) {
      suggestions.push(`Complete required fields: ${missingRequired.join(', ')}`);
    }

    if (missingOptional.length > 0) {
      suggestions.push(`Consider adding: ${missingOptional.join(', ')}`);
    }

    return suggestions;
  };

  // Enrich customer data with external sources
  const enrichCustomerData = async (customerData: CustomerFormValues) => {
    try {
      // Example: Enrich with social media profiles
      if (customerData.email) {
        const { data: enrichedData, error } = await supabase
          .functions.invoke('enrich-customer-data', {
            body: { email: customerData.email }
          });

        if (!error && enrichedData) {
          // Update customer with enriched data
          await updateFieldMutation.mutateAsync({
            field: 'social_profiles',
            value: enrichedData.socialProfiles
          });
        }
      }
    } catch (error) {
      console.error('Data enrichment error:', error);
    }
  };

  return {
    isSaving,
    updateField: updateFieldMutation.mutateAsync,
    calculateProfileCompleteness,
    enrichCustomerData
  };
}
