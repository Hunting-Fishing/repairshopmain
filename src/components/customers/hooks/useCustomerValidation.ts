
import { CustomerFormValues } from "../types/customerTypes";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function useCustomerValidation() {
  const validatePhoneNumber = (phoneNumber: string, country?: string): boolean => {
    if (!phoneNumber) return true;
    // Basic validation - can be enhanced with proper phone validation library
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCustomerData = (data: Partial<CustomerFormValues>): ValidationResult => {
    const errors: Record<string, string> = {};

    if (data.email && !validateEmail(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (data.phone_number && !validatePhoneNumber(data.phone_number, data.country)) {
      errors.phone_number = "Please enter a valid phone number";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  return {
    validateCustomerData,
    validateEmail,
    validatePhoneNumber
  };
}
