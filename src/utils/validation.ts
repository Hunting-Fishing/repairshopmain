
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import validator from 'validator';
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export async function validatePhone(phone: string, countryCode = 'US'): Promise<ValidationResult> {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    if (!phoneNumber) {
      return { isValid: false, message: 'Invalid phone number format' };
    }
    return { isValid: phoneNumber.isValid(), message: phoneNumber.isValid() ? undefined : 'Invalid phone number' };
  } catch (error) {
    return { isValid: false, message: 'Invalid phone number' };
  }
}

export async function validateEmail(email: string): Promise<ValidationResult> {
  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  return { isValid: true };
}

export async function validateAddress(
  street: string,
  city: string,
  state: string,
  postalCode: string,
  country: string
): Promise<ValidationResult> {
  if (!street || !city || !state || !postalCode || !country) {
    return { isValid: false, message: 'All address fields are required' };
  }
  
  if (!validator.isPostalCode(postalCode, country as any)) {
    return { isValid: false, message: 'Invalid postal code format' };
  }
  
  return { isValid: true };
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

  await supabase.from('customer_validation_logs').insert({
    customer_id: customerId,
    organization_id: userProfile.organization_id,
    validation_type: validationType,
    status,
    error_message: errorMessage,
    created_at: new Date().toISOString()
  });
}
