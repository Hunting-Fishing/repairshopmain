
export type CustomerType = "Personal" | "Business" | "Fleet";

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

export interface CustomerFormValues {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  customer_type: CustomerType;
  company_name?: string;
  business_classification_id?: string;
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
}
