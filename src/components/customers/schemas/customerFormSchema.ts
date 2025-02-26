
import * as z from "zod";
import { validationMessages } from "./validationMessages";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

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

export const customerFormSchema = z.object({
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
  company_name: z.string().optional(),
  company_size: z.string().optional(),
  business_classification_id: z.string().optional(),
  region_code: z.string().optional(),
  marketing_preferences: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    phone: z.boolean().optional()
  }).optional(),
  secondary_contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email(validationMessages.format.email).optional(),
    relationship: z.string().optional()
  }).optional(),
  id: z.string().optional()
}).refine((data) => {
  // Validate phone number with region for Personal customers
  if (data.customer_type === "Personal" && data.phone_number) {
    return validatePhoneWithRegion(data.phone_number, data.region_code);
  }
  return true;
}, {
  message: "Invalid phone number for the selected region",
  path: ["phone_number"]
}).refine((data) => {
  // Require and validate company name for Business customers
  if (data.customer_type === "Business") {
    return validateCompanyName(data.company_name);
  }
  return true;
}, {
  message: "Valid company name is required for business customers",
  path: ["company_name"]
}).refine((data) => {
  // Fleet customers require both company name and multiple contact methods
  if (data.customer_type === "Fleet") {
    return !!(data.company_name && 
             data.phone_number && 
             data.email && 
             validateCompanyName(data.company_name));
  }
  return true;
}, {
  message: "Fleet customers require company name and complete contact information",
  path: ["customer_type"]
});

export const customerValidationSchema = customerFormSchema;
