
import { CountryCode } from "libphonenumber-js";
import { validateEmail, validatePhoneNumber } from "@/utils/validation/fieldValidation";
import { CustomerFormValues } from "../types/customerTypes";

/**
 * Collection of validator functions for individual fields
 * Each validator returns boolean or string (error message)
 */
export const validators = {
  required: (value: any): boolean | string => {
    return !!value || "This field is required";
  },
  
  email: (value: string): boolean | string => {
    if (!value) return true;
    const validation = validateEmail(value);
    return validation.isValid || validation.message || "Invalid email format";
  },
  
  phoneNumber: (value: string, country?: CountryCode): boolean | string => {
    if (!value) return true;
    const validation = validatePhoneNumber(value, country);
    return validation.isValid || validation.message || "Invalid phone number format";
  },
  
  minLength: (value: string, min: number): boolean | string => {
    if (!value) return true;
    return value.length >= min || `Must be at least ${min} characters`;
  },
  
  maxLength: (value: string, max: number): boolean | string => {
    if (!value) return true;
    return value.length <= max || `Must be no more than ${max} characters`;
  },
  
  numeric: (value: any): boolean | string => {
    if (!value) return true;
    return (!isNaN(Number(value)) && isFinite(Number(value))) || "Must be a number";
  },
  
  // Used for nested object validation
  hasRequiredFields: (obj: Record<string, any>, requiredFields: string[]): boolean | string => {
    if (!obj) return "Required information is missing";
    
    for (const field of requiredFields) {
      if (!obj[field]) {
        return `${field.replace('_', ' ')} is required`;
      }
    }
    
    return true;
  }
};

/**
 * Type-specific validators for different customer types
 */
export const typeValidators = {
  Personal: {
    validateRequiredFields: (data: CustomerFormValues): string[] => {
      const errors: string[] = [];
      const requiredFields = ['first_name', 'last_name', 'email'];
      
      requiredFields.forEach(field => {
        const value = data[field as keyof CustomerFormValues];
        if (!value) {
          errors.push(`${field.replace('_', ' ')} is required`);
        }
      });
      
      return errors;
    }
  },
  
  Business: {
    validateRequiredFields: (data: CustomerFormValues): string[] => {
      const errors: string[] = [];
      const requiredFields = [
        'first_name', 'last_name', 'email', 
        'company_name', 'business_classification_id'
      ];
      
      requiredFields.forEach(field => {
        const value = data[field as keyof CustomerFormValues];
        if (!value) {
          errors.push(`${field.replace('_', ' ')} is required for business customers`);
        }
      });
      
      return errors;
    }
  },
  
  Fleet: {
    validateRequiredFields: (data: CustomerFormValues): string[] => {
      const errors: string[] = [];
      const requiredFields = [
        'first_name', 'last_name', 'email', 'company_name'
      ];
      
      requiredFields.forEach(field => {
        const value = data[field as keyof CustomerFormValues];
        if (!value) {
          errors.push(`${field.replace('_', ' ')} is required for fleet customers`);
        }
      });
      
      // Fleet specific validations
      if (!data.fleet_details) {
        errors.push('Fleet details are required');
      } else {
        const { vehicle_count, manager_name, manager_contact } = data.fleet_details;
        
        if (!vehicle_count) {
          errors.push('Vehicle count is required for fleet customers');
        }
        
        if (!manager_name) {
          errors.push('Fleet manager name is required');
        }
        
        if (!manager_contact) {
          errors.push('Manager contact information is required');
        }
      }
      
      return errors;
    }
  }
};
