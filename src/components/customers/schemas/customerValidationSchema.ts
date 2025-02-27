
import * as z from "zod";
import { validationMessages } from "./validationMessages";

const baseSchema = {
  customer_type: z.enum(["Personal", "Fleet", "Business"]),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email(validationMessages.format.email).optional(),
  phone_number: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  language_preference: z.string().optional(),
  timezone: z.string().optional(),
  // Fixed: properly handle numeric values with coercion
  loyalty_points: z.union([z.number(), z.string().transform(val => Number(val) || 0)]).optional(),
  total_spend: z.union([z.number(), z.string().transform(val => Number(val) || 0)]).optional(),
  // Ensure object fields are properly typed
  marketing_preferences: z.object({
    email: z.boolean().optional().default(false),
    sms: z.boolean().optional().default(false),
    phone: z.boolean().optional().default(false)
  }).optional().default({}),
  // Ensure array fields are properly typed
  tags: z.array(z.string()).optional().default([]),
  // Handle special structured fields properly
  address_book: z.array(
    z.object({
      type: z.enum(['home', 'work', 'other']).optional(),
      is_primary: z.boolean().optional(),
      street_address: z.string().optional(),
      city: z.string().optional(),
      state_province: z.string().optional(),
      postal_code: z.string().optional(),
      country: z.string().optional()
    })
  ).optional().default([]),
};

// Personal customer schema (base schema only)
const personalSchema = z.object({
  ...baseSchema,
  company_name: z.string().optional(),
  business_classification_id: z.string().optional(),
  company_size: z.string().optional(),
  fleet_details: z.any().optional()
});

// Business customer schema (includes business-specific fields)
const businessSchema = z.object({
  ...baseSchema,
  company_name: z.string().min(2, "Company name is required and must be at least 2 characters"),
  business_classification_id: z.string().min(1, "Business classification is required"),
  company_size: z.string().min(1, "Company size is required"),
  fleet_details: z.any().optional()
});

// Fleet customer schema
const fleetSchema = z.object({
  ...baseSchema,
  company_name: z.string().min(2, "Fleet name is required"),
  business_classification_id: z.string().optional(),
  company_size: z.string().optional(),
  // Properly define fleet_details structure
  fleet_details: z.object({
    account_number: z.string().optional(),
    vehicle_count: z.union([
      z.number().min(1, "Number of vehicles is required"), 
      z.string().transform(val => Number(val) || 0)
    ]).optional(),
    manager_name: z.string().min(1, "Fleet manager name is required").optional(),
    manager_contact: z.string().min(1, "Manager contact is required").optional(),
    service_schedule: z.string().optional(),
    vehicles: z.array(
      z.object({
        vin: z.string().optional(),
        plate_number: z.string().optional(),
        assigned_driver: z.string().optional(),
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.string().optional()
      })
    ).optional().default([])
  }).optional().default({}),
});

// Combined schema that validates based on customer type
export const customerValidationSchema = z.discriminatedUnion("customer_type", [
  personalSchema.extend({ customer_type: z.literal("Personal") }),
  businessSchema.extend({ customer_type: z.literal("Business") }),
  fleetSchema.extend({ customer_type: z.literal("Fleet") })
]);

// Add helper function to check which fields are required based on customer type
export const getRequiredFieldsForType = (customerType: "Personal" | "Business" | "Fleet") => {
  const baseFields = ["first_name", "last_name", "email", "customer_type"];
  
  switch (customerType) {
    case "Business":
      return [...baseFields, "company_name", "business_classification_id", "company_size"];
    case "Fleet":
      return [...baseFields, "company_name", "fleet_details"];
    case "Personal":
    default:
      return baseFields;
  }
};

// Helper function for form validation
export const validateFormFields = (
  values: any, 
  customerType: "Personal" | "Business" | "Fleet"
): { isValid: boolean; errors: string[] } => {
  const requiredFields = getRequiredFieldsForType(customerType);
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!values[field]) {
      const fieldName = field
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());
      
      errors.push(`${fieldName} is required for ${customerType} customers`);
    }
  });
  
  // Fleet-specific validation
  if (customerType === "Fleet" && values.fleet_details) {
    const { vehicle_count, manager_name, manager_contact } = values.fleet_details;
    
    if (!vehicle_count) errors.push("Vehicle count is required for Fleet customers");
    if (!manager_name) errors.push("Fleet manager name is required");
    if (!manager_contact) errors.push("Manager contact is required");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
