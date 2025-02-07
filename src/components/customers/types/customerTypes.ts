
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
}

export interface Customer {
  id: string;
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
  created_at: string;
}
