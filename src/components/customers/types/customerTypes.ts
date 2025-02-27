
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
  business_classification_id?: string;
  business_classification_other?: string;  // Added this field explicitly
  tax_number?: string;
  loyalty_tier?: string;
  loyalty_points?: string | number;  // Updated to accept both string and number
  total_spend?: string | number;     // Added this missing field
  notes?: string;
  pst_number?: string;
  social_profiles?: {
    linkedin?: string;
    twitter?: string;
  };
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
  customer_since?: string;
  loyalty_join_date?: string;
  tags?: string[];  // Added this missing field
  fleet_details?: {
    account_number?: string;
    vehicle_count?: number;
    manager_name?: string;
    manager_contact?: string;
    service_schedule?: string;
    vehicles?: FleetVehicle[];
  };
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

export type CustomerType = 'Personal' | 'Fleet' | 'Business';

export interface BusinessRuleValidation {
  type: CustomerType;
  rules: ValidationRule[];
}

export interface CustomerRelationship {
  id: string;
  parent_customer_id: string;
  related_customer_id: string;
  relationship_type: 'family' | 'business' | 'affiliate' | 'subsidiary';
  hierarchy_level: number;
  is_primary: boolean;
  metadata: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
  organization_id: string;
  created_by: string;
  parent_first_name?: string;
  parent_last_name?: string;
  related_first_name?: string;
  related_last_name?: string;
  depth?: number;
}

export interface CustomerRelationshipFormValues {
  relationship_type: CustomerRelationship['relationship_type'];
  related_customer_id: string;
  is_primary: boolean;
  notes?: string;
}

export interface FleetVehicle {
  vin: string;
  plate_number: string;
  assigned_driver: string;
  make?: string;
  model?: string;
  year?: string;
}
