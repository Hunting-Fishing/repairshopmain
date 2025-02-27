
import { CustomerFormValues } from "../types/customerTypes";
import { ValidationService } from "../validation/validationService";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function useCustomerValidation() {
  const validatePhoneNumber = (phoneNumber: string, country?: string): boolean => {
    const result = ValidationService.validateField('phone_number', phoneNumber, 'Personal');
    return result.isValid;
  };

  const validateEmail = (email: string): boolean => {
    const result = ValidationService.validateField('email', email, 'Personal');
    return result.isValid;
  };

  const validateCustomerData = (data: Partial<CustomerFormValues>): ValidationResult => {
    return ValidationService.validateCustomerData(data as CustomerFormValues);
  };

  return {
    validateCustomerData,
    validateEmail,
    validatePhoneNumber
  };
}
