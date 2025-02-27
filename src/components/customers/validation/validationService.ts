
import { CustomerFormValues, CustomerType } from "../types/customerTypes";
import { validateEmail, validatePhoneNumber } from "@/utils/validation/fieldValidation";
import { ValidationResult } from "../hooks/useCustomerValidation";
import { customerValidationSchema, getRequiredFieldsForType } from "../schemas/customerValidationSchema";
import { z } from "zod";

/**
 * Core validation service that centralizes all validation logic
 */
export class ValidationService {
  /**
   * Validates a form using Zod schema validation
   */
  static validateSchema(data: CustomerFormValues): ValidationResult {
    try {
      customerValidationSchema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });
        return { isValid: false, errors: formattedErrors };
      }
      return { 
        isValid: false, 
        errors: { form: 'Invalid form data' } 
      };
    }
  }

  /**
   * Validates individual fields with custom validation logic
   */
  static validateField(
    fieldName: keyof CustomerFormValues, 
    value: any, 
    customerType: CustomerType
  ): ValidationResult {
    const errors: Record<string, string> = {};
    
    // Check if the field is required based on customer type
    const requiredFields = getRequiredFieldsForType(customerType);
    const isRequired = requiredFields.includes(fieldName);
    
    // Check for empty required fields
    if (isRequired && (value === undefined || value === null || value === '')) {
      errors[fieldName] = `${this.formatFieldName(fieldName)} is required`;
      return { isValid: Object.keys(errors).length === 0, errors };
    }
    
    // Specific field validation
    switch (fieldName) {
      case 'email':
        if (value) {
          const emailValidation = validateEmail(value);
          if (!emailValidation.isValid) {
            errors[fieldName] = emailValidation.message || 'Invalid email format';
          }
        }
        break;
        
      case 'phone_number':
        if (value) {
          const phoneValidation = validatePhoneNumber(value);
          if (!phoneValidation.isValid) {
            errors[fieldName] = phoneValidation.message || 'Invalid phone number format';
          }
        }
        break;
        
      case 'company_name':
        if (value && (customerType === 'Business' || customerType === 'Fleet')) {
          if (value.length < 2) {
            errors[fieldName] = 'Company name must be at least 2 characters';
          }
        }
        break;
        
      // Add other field-specific validations here
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  }
  
  /**
   * Comprehensive validation that combines schema and business rule validation
   */
  static validateCustomerData(data: CustomerFormValues): ValidationResult {
    // First validate using zod schema
    const schemaValidation = this.validateSchema(data);
    if (!schemaValidation.isValid) {
      return schemaValidation;
    }
    
    // Then apply business rules
    const businessRuleValidation = this.validateBusinessRules(data);
    if (!businessRuleValidation.isValid) {
      return businessRuleValidation;
    }
    
    // Apply customer type-specific validation
    return this.validateCustomerType(data);
  }
  
  /**
   * Validates business rules that span multiple fields
   */
  static validateBusinessRules(data: CustomerFormValues): ValidationResult {
    const errors: Record<string, string> = {};
    
    // Cross-field validations
    if (data.customer_type === 'Business' || data.customer_type === 'Fleet') {
      if (!data.company_name) {
        errors['company_name'] = `Company name is required for ${data.customer_type.toLowerCase()} customers`;
      }
    }
    
    if (data.customer_type === 'Fleet') {
      if (!data.fleet_details) {
        errors['fleet_details'] = 'Fleet details are required';
      } else {
        const { vehicle_count, manager_name, manager_contact } = data.fleet_details;
        
        if (!vehicle_count) {
          errors['fleet_details.vehicle_count'] = 'Vehicle count is required for fleet customers';
        }
        
        if (!manager_name) {
          errors['fleet_details.manager_name'] = 'Fleet manager name is required';
        }
        
        if (!manager_contact) {
          errors['fleet_details.manager_contact'] = 'Manager contact is required';
        }
      }
    }
    
    if (data.customer_type === 'Business') {
      if (!data.business_classification_id) {
        errors['business_classification_id'] = 'Business classification is required';
      }
    }
    
    // Address validation
    if (data.customer_type === 'Business' && (!data.street_address || !data.city || !data.state_province)) {
      errors['address'] = 'Complete address information is required for business customers';
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  }
  
  /**
   * Customer type-specific validation
   */
  static validateCustomerType(data: CustomerFormValues): ValidationResult {
    const errors: Record<string, string> = {};
    
    switch (data.customer_type) {
      case 'Personal':
        // Personal customer validations
        break;
        
      case 'Business':
        // Business-specific validations
        break;
        
      case 'Fleet':
        // Fleet-specific validations
        break;
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  }
  
  /**
   * Helper to format field names for error messages
   */
  private static formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  }
}
