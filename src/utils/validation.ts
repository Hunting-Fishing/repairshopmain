
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import validator from 'validator';
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  method?: string;
}

async function getActiveValidationMethod(): Promise<string> {
  const { data } = await supabase
    .from('validation_methods')
    .select('name')
    .eq('is_active', true)
    .single();
  
  return data?.name || 'basic';
}

export async function validatePhone(phone: string, countryCode: CountryCode = 'US'): Promise<ValidationResult> {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    if (!phoneNumber) {
      return { isValid: false, message: 'Invalid phone number format', method: 'basic' };
    }
    return { 
      isValid: phoneNumber.isValid(), 
      message: phoneNumber.isValid() ? undefined : 'Invalid phone number',
      method: 'basic'
    };
  } catch (error) {
    return { isValid: false, message: 'Invalid phone number', method: 'basic' };
  }
}

export async function validateEmail(email: string): Promise<ValidationResult> {
  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Invalid email format', method: 'basic' };
  }
  return { isValid: true, method: 'basic' };
}

export async function validateAddress(
  street: string,
  city: string,
  state: string,
  postalCode: string,
  country: string
): Promise<ValidationResult> {
  const validationMethod = await getActiveValidationMethod();

  // Basic validation first
  if (!street || !city || !state || !postalCode || !country) {
    return { 
      isValid: false, 
      message: 'All address fields are required',
      method: validationMethod
    };
  }
  
  if (!validator.isPostalCode(postalCode, country as any)) {
    return { 
      isValid: false, 
      message: 'Invalid postal code format',
      method: validationMethod
    };
  }

  // If Google Places validation is active, we'll implement it here later
  if (validationMethod === 'google_places') {
    // For now, return basic validation until Google Places is implemented
    return {
      isValid: true,
      message: 'Address validated (Google Places validation pending implementation)',
      method: 'google_places'
    };
  }
  
  return { isValid: true, method: validationMethod };
}

export async function logValidationAttempt(
  customerId: string,
  validationType: string,
  status: 'pending' | 'valid' | 'invalid',
  errorMessage?: string
) {
  const { data: profile } = await supabase.auth.getSession();
  if (!profile.session?.user.id) return;

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', profile.session.user.id)
    .single();

  if (!userProfile?.organization_id) return;

  const validationMethod = await getActiveValidationMethod();

  await supabase.from('customer_validation_logs').insert({
    customer_id: customerId,
    organization_id: userProfile.organization_id,
    validation_type: validationType,
    validation_method: validationMethod,
    status,
    error_message: errorMessage,
    created_at: new Date().toISOString()
  });

  // This will trigger the customer_analytics update via database trigger
}
