
import { CustomerFormValues, CustomerType } from "../types/customerTypes";

type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const validateCustomerBusinessRules = (
  values: CustomerFormValues,
  customerType: CustomerType
): ValidationResult => {
  const errors: string[] = [];

  // Common validations
  if (!values.first_name || !values.last_name) {
    errors.push("First name and last name are required");
  }

  if (!values.email) {
    errors.push("Email address is required");
  }

  // Type-specific validations
  switch (customerType) {
    case "Business":
      if (!values.company_name) {
        errors.push("Company name is required for business customers");
      }
      if (!values.business_classification_id) {
        errors.push("Business classification is required for business customers");
      }
      break;

    case "Fleet":
      if (!values.company_name) {
        errors.push("Company name is required for fleet customers");
      }
      if (!values.fleet_details) {
        errors.push("Fleet details are required for fleet customers");
      } else {
        const { vehicle_count, manager_name, manager_contact } = values.fleet_details;
        if (!vehicle_count || vehicle_count < 1) {
          errors.push("Fleet must have at least one vehicle");
        }
        if (!manager_name) {
          errors.push("Fleet manager name is required");
        }
        if (!manager_contact) {
          errors.push("Fleet manager contact information is required");
        }
      }
      break;

    case "Personal":
      // Additional personal customer validations can be added here
      break;

    default:
      errors.push("Invalid customer type");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
