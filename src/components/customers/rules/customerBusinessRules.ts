
import { CustomerFormValues, CustomerType, BusinessRuleValidation } from "../types/customerTypes";

// Business rules by customer type
export const customerBusinessRules: BusinessRuleValidation[] = [
  {
    type: "Personal",
    rules: [
      {
        field: "phone_number",
        validate: (value, formData) => {
          return !!value && value.length >= 10;
        },
        errorMessage: "Personal customers must provide a valid phone number"
      },
      {
        field: "email",
        validate: (value) => {
          return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        errorMessage: "Personal customers must provide a valid email address"
      }
    ]
  },
  {
    type: "Business",
    rules: [
      {
        field: "company_name",
        validate: (value) => !!value && value.length >= 2,
        errorMessage: "Business name is required and must be at least 2 characters"
      },
      {
        field: "business_classification_id",
        validate: (value) => !!value,
        errorMessage: "Business classification is required for business customers"
      },
      {
        field: "company_size",
        validate: (value) => !!value,
        errorMessage: "Company size is required for business customers"
      }
    ]
  },
  {
    type: "Fleet",
    rules: [
      {
        field: "company_name",
        validate: (value) => !!value && value.length >= 2,
        errorMessage: "Fleet name is required and must be at least 2 characters"
      },
      {
        field: "phone_number",
        validate: (value) => !!value,
        errorMessage: "Fleet customers must provide a contact phone number"
      },
      {
        field: "email",
        validate: (value) => !!value,
        errorMessage: "Fleet customers must provide a contact email"
      },
      {
        field: "secondary_contact",
        validate: (value) => !!value && !!value.name && (!!value.phone || !!value.email),
        errorMessage: "Fleet customers must provide secondary contact information"
      }
    ]
  }
];

// Validate customer data against business rules
export function validateCustomerBusinessRules(
  data: CustomerFormValues,
  customerType: CustomerType
): { isValid: boolean; errors: string[] } {
  const relevantRules = customerBusinessRules.find(rules => rules.type === customerType);
  const errors: string[] = [];

  if (!relevantRules) {
    return { isValid: true, errors: [] };
  }

  relevantRules.rules.forEach(rule => {
    const isValid = rule.validate(data[rule.field], data);
    if (!isValid) {
      errors.push(rule.errorMessage);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Lifecycle stage determination based on customer data
export function determineCustomerLifecycleStage(data: CustomerFormValues): string {
  if (!data.customer_since) {
    return 'new';
  }

  const customerSinceDate = new Date(data.customer_since);
  const daysSinceJoining = Math.floor(
    (new Date().getTime() - customerSinceDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceJoining < 30) {
    return 'onboarding';
  } else if (daysSinceJoining < 90) {
    return 'active';
  } else if (data.loyalty_points && parseInt(data.loyalty_points) > 1000) {
    return 'loyal';
  } else {
    return 'established';
  }
}

// Workflow automation triggers
export async function handleCustomerDataChanges(
  oldData: CustomerFormValues | null,
  newData: CustomerFormValues
): Promise<void> {
  // Loyalty program enrollment trigger
  if (!oldData?.loyalty_join_date && shouldEnrollInLoyalty(newData)) {
    await enrollInLoyaltyProgram(newData);
  }

  // Communication preference changes
  if (oldData && hasChangedCommunicationPreferences(oldData, newData)) {
    await updateCommunicationPreferences(newData);
  }

  // Customer type upgrade detection
  if (oldData && hasUpgradedCustomerType(oldData, newData)) {
    await handleCustomerUpgrade(newData);
  }
}

// Helper functions
async function enrollInLoyaltyProgram(customer: CustomerFormValues): Promise<void> {
  // Implementation would go here
}

function shouldEnrollInLoyalty(customer: CustomerFormValues): boolean {
  return !customer.loyalty_join_date && 
         !!customer.email && 
         !!customer.phone_number;
}

function hasChangedCommunicationPreferences(
  oldData: CustomerFormValues,
  newData: CustomerFormValues
): boolean {
  return JSON.stringify(oldData.marketing_preferences) !== 
         JSON.stringify(newData.marketing_preferences);
}

function hasUpgradedCustomerType(
  oldData: CustomerFormValues,
  newData: CustomerFormValues
): boolean {
  const typeHierarchy = {
    'Personal': 1,
    'Business': 2,
    'Fleet': 3
  };
  
  return typeHierarchy[newData.customer_type] > typeHierarchy[oldData.customer_type];
}

async function updateCommunicationPreferences(customer: CustomerFormValues): Promise<void> {
  // Implementation would go here
}

async function handleCustomerUpgrade(customer: CustomerFormValues): Promise<void> {
  // Implementation would go here
}
