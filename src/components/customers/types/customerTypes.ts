
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
  company_name?: string;
  company_size?: string;
  business_classification_id?: string;
  loyalty_tier?: string;
  loyalty_points?: string;
  preferred_contact_time?: {
    start: string;
    end: string;
  };
  secondary_contact?: {
    name?: string;
    phone?: string;
    email?: string;
    relationship?: string;
    is_emergency?: boolean;
  };
  marketing_preferences?: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  address_book?: CustomerAddress[];
  id?: string;
  region_code?: string;
}

export interface Customer extends CustomerFormValues {
  id: string;
  created_at: string;
}

export interface BusinessClassification {
  id: string;
  name: string;
  description?: string;
}

export interface CustomerAddress {
  type: 'home' | 'work' | 'other';
  is_primary: boolean;
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

export interface ValidationRule {
  field: keyof CustomerFormValues;
  validate: (value: any, formData: CustomerFormValues) => boolean | string;
  errorMessage: string;
}

// Business Rules Types
export type CustomerType = 'Personal' | 'Fleet' | 'Business';

export interface BusinessRuleValidation {
  type: CustomerType;
  rules: ValidationRule[];
}
