
import { CustomerFormValues } from "../types/customerTypes";

export function useCustomerEnrichment() {
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

    // Format and validate phone number
    if (enrichedData.phone_number) {
      enrichedData.phone_number = enrichedData.phone_number.replace(/\D/g, '');
    }

    // Enrich social profiles
    if (enrichedData.social_profiles?.linkedin) {
      const linkedinUrl = enrichedData.social_profiles.linkedin;
      if (!linkedinUrl.includes('linkedin.com')) {
        enrichedData.social_profiles.linkedin = `https://linkedin.com/in/${linkedinUrl}`;
      }
    }

    if (enrichedData.social_profiles?.twitter) {
      const twitterHandle = enrichedData.social_profiles.twitter;
      if (!twitterHandle.startsWith('@')) {
        enrichedData.social_profiles.twitter = `@${twitterHandle}`;
      }
    }

    return enrichedData;
  };

  return {
    enrichCustomerData
  };
}
