
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

// Helper to validate company name
const validateCompanyName = (value: string | undefined) => {
  if (!value) return false;
  return value.length >= 2 && value.length <= 100;
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
  customer_type: z.enum(["Personal", "Fleet", "Business"]),
  language_preference: z.string().optional(),
  timezone: z.string({
    required_error: validationMessages.required.timezone,
  }).min(1, validationMessages.required.timezone),
  id: z.string().optional()
};

// Personal customer schema
const personalSchema = z.object(baseSchema);

// Business customer schema
const businessSchema = z.object({
  ...baseSchema,
  company_name: z.string().min(2, "Company name is required and must be at least 2 characters"),
  business_classification_id: z.string().min(1, "Business classification is required"),
  company_size: z.string().min(1, "Company size is required"),
  pst_number: z.string().optional()
});

// Fleet customer schema
const fleetSchema = z.object({
  ...baseSchema,
  company_name: z.string().min(2, "Fleet name is required"),
  fleet_details: z.object({
    account_number: z.string().optional(),
    vehicle_count: z.number().min(1, "Number of vehicles is required"),
    manager_name: z.string().min(1, "Fleet manager name is required"),
    manager_contact: z.string().min(1, "Manager contact is required"),
    service_schedule: z.string().optional()
  }).optional(),
  payment_billing: z.object({
    billing_contact: z.string().min(1, "Billing contact is required"),
    billing_email: z.string().email("Valid billing email is required"),
    payment_terms: z.string().min(1, "Payment terms are required")
  }).optional(),
  insurance_compliance: z.object({
    insurance_provider: z.string().min(1, "Insurance provider is required"),
    policy_number: z.string().min(1, "Policy number is required")
  }).optional()
});

// Combined schema that validates based on customer type
export const customerFormSchema = z.discriminatedUnion("customer_type", [
  personalSchema.extend({ customer_type: z.literal("Personal") }),
  businessSchema.extend({ customer_type: z.literal("Business") }),
  fleetSchema.extend({ customer_type: z.literal("Fleet") })
]);

export const debouncedValidation = (data: any) => {
  const schema = customerFormSchema;
  return schema.safeParse(data);
};

export const customerValidationSchema = customerFormSchema;
