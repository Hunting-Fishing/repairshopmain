
import { CustomerFormValues, CustomerType } from "../types/customerTypes";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  userData: {
    user: {
      id: string;
    };
  };
  profileData: {
    organization_id: string;
  };
}

export class CustomerDataService {
  static async prepareDataForSave(data: Partial<CustomerFormValues>, customerId: string) {
    const { userData, profileData } = await this.getUserData();
    const baseFields = this.prepareBaseFields(data, customerId, userData.user.id, profileData.organization_id);
    return this.addTypeSpecificFields(data.customer_type as CustomerType, baseFields, data);
  }

  private static async getUserData(): Promise<UserData> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not authenticated");

    const { data: profileData } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', userData.user.id)
      .single();

    if (!profileData) throw new Error("No profile found");

    return { userData, profileData };
  }

  private static prepareBaseFields(
    data: Partial<CustomerFormValues>,
    customerId: string,
    userId: string,
    organizationId: string
  ) {
    const baseFields = {
      id: customerId,
      organization_id: organizationId,
      customer_type: data.customer_type,
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
      created_by: userId,
      updated_by: userId,
      updated_at: new Date().toISOString()
    };

    return Object.fromEntries(
      Object.entries(baseFields).filter(([_, value]) => value !== undefined)
    );
  }

  private static addTypeSpecificFields(
    customerType: CustomerType,
    baseFields: Record<string, any>,
    data: Partial<CustomerFormValues>
  ) {
    const typeSpecificFields: Record<CustomerType, Record<string, any>> = {
      'Business': {
        company_name: data.company_name,
        business_classification_id: data.business_classification_id,
        fleet_details: null
      },
      'Fleet': {
        company_name: data.company_name,
        fleet_details: data.fleet_details,
        business_classification_id: null
      },
      'Personal': {
        company_name: null,
        business_classification_id: null,
        fleet_details: null
      }
    };

    return {
      ...baseFields,
      ...typeSpecificFields[customerType]
    };
  }
}
