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
  fleet_details: z.object({
    account_number: z.string().optional(),
    vehicle_count: z.number().min(1, "Number of vehicles is required"),
    manager_name: z.string().min(1, "Fleet manager name is required"),
    manager_contact: z.string().min(1, "Manager contact is required"),
    service_schedule: z.string().optional()
  }).optional(),
});

// Combined schema that validates based on customer type
export const customerValidationSchema = z.discriminatedUnion("customer_type", [
  personalSchema.extend({ customer_type: z.literal("Personal") }),
  businessSchema.extend({ customer_type: z.literal("Business") }),
  fleetSchema.extend({ customer_type: z.literal("Fleet") })
]);

// Add helper function to check which fields are required based on customer type
export const getRequiredFieldsForType = (customerType: "Personal" | "Business" | "Fleet") => {
  return ["customer_type"];
};
