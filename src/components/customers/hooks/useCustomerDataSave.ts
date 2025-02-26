
import { useMutation } from "@tanstack/react-query";
import { CustomerFormValues } from "../types/customerTypes";
import { supabase } from "@/integrations/supabase/client";

interface ProfileCompleteness {
  score: number;
  missingFields: string[];
  recommendations: string[];
}

export function useCustomerDataSave(customerId: string) {
  const updateField = useMutation({
    mutationFn: async ({ field, value }: { field: keyof CustomerFormValues; value: any }) => {
      const { data, error } = await supabase
        .from('customers')
        .update({ [field]: value })
        .eq('id', customerId);

      if (error) throw error;
      return data;
    }
  });

  const calculateProfileCompleteness = (data: CustomerFormValues): ProfileCompleteness => {
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'phone_number',
      'street_address',
      'city',
      'state_province',
      'postal_code',
      'country'
    ];

    const businessFields = [
      'company_name',
      'company_size',
      'business_classification_id'
    ];

    const optionalFields = [
      'social_profiles',
      'language_preference',
      'timezone',
      'preferred_contact_time',
      'secondary_contact'
    ];

    let totalFields = requiredFields.length;
    let completedFields = 0;
    const missingFields: string[] = [];
    const recommendations: string[] = [];

    // Check required fields
    requiredFields.forEach(field => {
      if (data[field as keyof CustomerFormValues]) {
        completedFields++;
      } else {
        missingFields.push(field);
        recommendations.push(`Add ${field.replace(/_/g, ' ')} to improve profile completeness`);
      }
    });

    // Check business-specific fields if customer type is Business
    if (data.customer_type === 'Business') {
      totalFields += businessFields.length;
      businessFields.forEach(field => {
        if (data[field as keyof CustomerFormValues]) {
          completedFields++;
        } else {
          missingFields.push(field);
          recommendations.push(`Add ${field.replace(/_/g, ' ')} to complete business profile`);
        }
      });
    }

    // Check optional fields for enhanced profile
    optionalFields.forEach(field => {
      const value = data[field as keyof CustomerFormValues];
      if (!value) {
        recommendations.push(`Consider adding ${field.replace(/_/g, ' ')} for a richer profile`);
      }
    });

    // Calculate score as a percentage
    const score = (completedFields / totalFields) * 100;

    return {
      score,
      missingFields,
      recommendations
    };
  };

  const enrichCustomerData = async (customerData: CustomerFormValues): Promise<CustomerFormValues> => {
    let enrichedData = { ...customerData };

    // Add timezone based on location if not set
    if (!enrichedData.timezone && enrichedData.city && enrichedData.country) {
      try {
        const response = await fetch(
          `https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=position&lat=${0}&lng=${0}`
        );
        const data = await response.json();
        if (data.zoneName) {
          enrichedData.timezone = data.zoneName;
        }
      } catch (error) {
        console.error('Error fetching timezone:', error);
      }
    }

    // Format and validate phone number if present
    if (enrichedData.phone_number) {
      enrichedData.phone_number = enrichedData.phone_number.replace(/\D/g, '');
    }

    // Enrich with social profiles if available
    if (enrichedData.social_profiles?.linkedin) {
      // Add LinkedIn validation/enrichment logic here
      const linkedinUrl = enrichedData.social_profiles.linkedin;
      if (!linkedinUrl.includes('linkedin.com')) {
        enrichedData.social_profiles.linkedin = `https://linkedin.com/in/${linkedinUrl}`;
      }
    }

    if (enrichedData.social_profiles?.twitter) {
      // Add Twitter/X validation/enrichment logic here
      const twitterHandle = enrichedData.social_profiles.twitter;
      if (!twitterHandle.startsWith('@')) {
        enrichedData.social_profiles.twitter = `@${twitterHandle}`;
      }
    }

    return enrichedData;
  };

  return {
    isSaving: updateField.isLoading,
    updateField: updateField.mutateAsync,
    calculateProfileCompleteness,
    enrichCustomerData
  };
}
