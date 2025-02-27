
import * as z from "zod";
import { validationMessages } from "./validationMessages";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { CustomerType } from "../types/customerTypes";

// Helper function to validate phone number format with region
const validatePhoneWithRegion = (phone: string, region?: string) => {
  if (!phone) return true;
  try {
    if (!region) return isValidPhoneNumber(phone);
    return isValidPhoneNumber(phone, region as any);
  } catch {
    return false;
  }
};

// Base schema with common fields for all customer types
const baseSchema = {
  first_name: z.string().min(1, validationMessages.required.first_name),
  last_name: z.string().min(1, validationMessages.required.last_name),
  email: z.string().email(validationMessages.format.email),
  phone_number: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string({
    required_error: validationMessages.required.country,
  }).min(1, validationMessages.required.country),
  language_preference: z.string().optional(),
  timezone: z.string({
    required_error: validationMessages.required.timezone,
  }).min(1, validationMessages.required.timezone),
  id: z.string().optional()
};

// Personal customer schema (base schema only)
const personalSchema = z.object({
  ...baseSchema,
  customer_type: z.literal("Personal"),
  company_name: z.string().optional(),
  business_classification_id: z.string().optional(),
  company_size: z.string().optional(),
  fleet_details: z.any().optional()
});

// Business customer schema (includes business-specific fields)
const businessSchema = z.object({
  ...baseSchema,
  customer_type: z.literal("Business"),
  company_name: z.string().min(2, "Company name is required and must be at least 2 characters"),
  business_classification_id: z.string().min(1, "Business classification is required"),
  company_size: z.string().min(1, "Company size is required"),
  fleet_details: z.any().optional()
});

// Fleet customer schema
const fleetSchema = z.object({
  ...baseSchema,
  customer_type: z.literal("Fleet"),
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
export const customerFormSchema = z.discriminatedUnion("customer_type", [
  personalSchema,
  businessSchema,
  fleetSchema
]);

export const debouncedValidation = (data: any) => {
  const schema = customerFormSchema;
  return schema.safeParse(data);
};

export const customerValidationSchema = customerFormSchema;
