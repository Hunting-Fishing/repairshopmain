
import { useState, useCallback } from "react";
import { ValidationService } from "../validation/validationService";
import { CustomerFormValues, CustomerType } from "../types/customerTypes";
import { ValidationResult } from "./useCustomerValidation";

export interface UseFormValidationProps {
  initialCustomerType?: CustomerType;
}

export function useFormValidation({ initialCustomerType = 'Personal' }: UseFormValidationProps = {}) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [customerType, setCustomerType] = useState<CustomerType>(initialCustomerType);
  
  /**
   * Validates a single field and updates errors state
   */
  const validateField = useCallback((name: keyof CustomerFormValues, value: any) => {
    const result = ValidationService.validateField(name, value, customerType);
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      
      if (!result.isValid) {
        // Add new errors
        Object.entries(result.errors).forEach(([key, value]) => {
          newErrors[key] = value;
        });
      } else {
        // Remove errors for this field
        delete newErrors[name];
      }
      
      return newErrors;
    });
    
    return result;
  }, [customerType]);
  
  /**
   * Validates the entire form
   */
  const validateForm = useCallback((data: CustomerFormValues): ValidationResult => {
    // Update customer type from form data to ensure we're using the current type
    if (data.customer_type && data.customer_type !== customerType) {
      setCustomerType(data.customer_type);
    }
    
    const result = ValidationService.validateCustomerData(data);
    setValidationErrors(result.errors);
    return result;
  }, [customerType]);
  
  /**
   * Clears all validation errors
   */
  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);
  
  /**
   * Updates customer type for validation context
   */
  const updateCustomerType = useCallback((type: CustomerType) => {
    setCustomerType(type);
  }, []);
  
  return {
    validateField,
    validateForm,
    clearErrors,
    updateCustomerType,
    validationErrors,
    customerType
  };
}
