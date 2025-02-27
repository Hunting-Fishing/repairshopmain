
import { CustomerFormValues, CustomerType } from "../types/customerTypes";

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class CustomerValidationService {
  static validateRequiredFields(data: CustomerFormValues): void {
    const validationResults = [
      this.validateBaseFields(data),
      this.validateByCustomerType(data)
    ];

    const failedValidation = validationResults.find(result => !result.isValid);
    if (failedValidation) {
      throw new Error(failedValidation.error);
    }
  }

  private static validateBaseFields(data: CustomerFormValues): ValidationResult {
    const requiredBaseFields = {
      first_name: "First name",
      last_name: "Last name"
    };

    for (const [field, label] of Object.entries(requiredBaseFields)) {
      if (!data[field as keyof CustomerFormValues]) {
        return {
          isValid: false,
          error: `${label} is required`
        };
      }
    }

    return { isValid: true };
  }

  private static validateByCustomerType(data: CustomerFormValues): ValidationResult {
    const validators: Record<CustomerType, (data: CustomerFormValues) => ValidationResult> = {
      'Business': this.validateBusinessCustomer,
      'Fleet': this.validateFleetCustomer,
      'Personal': () => ({ isValid: true })
    };

    const validator = validators[data.customer_type];
    if (!validator) {
      return {
        isValid: false,
        error: "Invalid customer type"
      };
    }

    return validator(data);
  }

  private static validateBusinessCustomer(data: CustomerFormValues): ValidationResult {
    if (!data.company_name) {
      return {
        isValid: false,
        error: "Company name is required for business customers"
      };
    }
    if (!data.business_classification_id) {
      return {
        isValid: false,
        error: "Business classification is required for business customers"
      };
    }
    return { isValid: true };
  }

  private static validateFleetCustomer(data: CustomerFormValues): ValidationResult {
    if (!data.company_name) {
      return {
        isValid: false,
        error: "Company name is required for fleet customers"
      };
    }
    if (!data.fleet_details) {
      return {
        isValid: false,
        error: "Fleet details are required for fleet customers"
      };
    }
    return { isValid: true };
  }
}
