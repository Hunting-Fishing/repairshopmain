
import { CustomerFormValues } from "../types/customerTypes";

interface ProfileCompleteness {
  score: number;
  missingFields: string[];
  recommendations: string[];
}

export function useProfileCompleteness() {
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

    requiredFields.forEach(field => {
      if (data[field as keyof CustomerFormValues]) {
        completedFields++;
      } else {
        missingFields.push(field);
        recommendations.push(`Add ${field.replace(/_/g, ' ')} to improve profile completeness`);
      }
    });

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

    optionalFields.forEach(field => {
      const value = data[field as keyof CustomerFormValues];
      if (!value) {
        recommendations.push(`Consider adding ${field.replace(/_/g, ' ')} for a richer profile`);
      }
    });

    const score = (completedFields / totalFields) * 100;

    return {
      score,
      missingFields,
      recommendations
    };
  };

  return {
    calculateProfileCompleteness
  };
}
