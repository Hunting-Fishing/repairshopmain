
export interface CustomerFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  street_address?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  customer_type: 'Personal' | 'Fleet' | 'Business';
  language_preference?: string;
  timezone?: string;
  company_size?: string;
  business_classification_id?: string;
  preferred_contact_time?: {
    start: string;
    end: string;
  };
  secondary_contact?: {
    name?: string;
    phone?: string;
    email?: string;
    relationship?: string;
  };
  marketing_preferences?: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  id?: string; // Added this line to support edit mode
}

export interface Customer extends CustomerFormValues {
  id: string;
  created_at: string;
  address_book: Array<{
    type: string;
    street_address: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
  }>;
}

export interface BusinessClassification {
  id: string;
  name: string;
  description?: string;
}
