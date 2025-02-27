
import { CustomerFormValues, CustomerType } from "../types/customerTypes";

export class CustomerValidationService {
  static validateRequiredFields(data: CustomerFormValues): void {
    const baseValidation = this.validateBaseFields(data);
    const typeSpecificValidation = this.validateByCustomerType(data);
    
    if (!baseValidation.isValid) throw new Error(baseValidation.error);
    if (!typeSpecificValidation.isValid) throw new Error(typeSpecificValidation.error);
  }

  private static validateBaseFields(data: CustomerFormValues): { isValid: boolean; error?: string } {
    if (!data.first_name || !data.last_name) {
      return {
        isValid: false,
        error: "First name and last name are required"
      };
    }
    return { isValid: true };
  }

  private static validateByCustomerType(data: CustomerFormValues): { isValid: boolean; error?: string } {
    const validationMap: Record<CustomerType, () => { isValid: boolean; error?: string }> = {
      'Business': () => this.validateBusinessCustomer(data),
      'Fleet': () => this.validateFleetCustomer(data),
      'Personal': () => ({ isValid: true })
    };

    return validationMap[data.customer_type]();
  }

  private static validateBusinessCustomer(data: CustomerFormValues): { isValid: boolean; error?: string } {
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

  private static validateFleetCustomer(data: CustomerFormValues): { isValid: boolean; error?: string } {
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
