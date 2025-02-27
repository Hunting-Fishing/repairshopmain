
export type CustomerType = "Personal" | "Business" | "Fleet";

export interface MarketingPreferences {
  email: boolean;
  sms: boolean;
  phone: boolean;
}

export interface SocialProfiles {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface SecondaryContact {
  name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
  is_emergency?: boolean;
}

export interface FleetDetails {
  account_number?: string;
  vehicle_count: number;
  manager_name: string;
  manager_contact: string;
  service_schedule?: string;
}

export interface AddressBook {
  type: "billing" | "shipping" | "other";
  is_primary: boolean;
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

export interface PreferredContactTime {
  start?: string;
  end?: string;
}

export interface CustomerFormValues {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  customer_type: CustomerType;
  company_name?: string;
  business_classification_id?: string;
  business_classification_other?: string;
  company_size?: string;
  fleet_details?: FleetDetails;
  street_address?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  language_preference?: string;
  timezone?: string;
  tax_number?: string;
  address_book?: AddressBook[];
  marketing_preferences?: MarketingPreferences;
  social_profiles?: SocialProfiles;
  secondary_contact?: SecondaryContact;
  preferred_contact_time?: PreferredContactTime;
}

export interface CustomerRelationship {
  id: string;
  parent_customer_id: string;
  related_customer_id: string;
  relationship_type: string;
  parent_first_name?: string;
  parent_last_name?: string;
  related_first_name?: string;
  related_last_name?: string;
}

export interface CustomerRelationshipFormValues {
  customer_id: string;
  related_customer_id: string;
  relationship_type: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  customer_type: CustomerType;
  created_at: string;
  // Add other relevant fields
}
