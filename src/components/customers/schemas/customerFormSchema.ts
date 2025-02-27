
import * as z from "zod";
import { validationMessages } from "./validationMessages";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { CustomerType } from "../types/customerTypes";

// Validation utility functions
const validationUtils = {
  phoneNumber: (phone: string, region?: string): boolean => {
    if (!phone) return true;
    try {
      return region ? isValidPhoneNumber(phone, region as any) : isValidPhoneNumber(phone);
    } catch {
      return false;
    }
  }
};

// Common schema fragments
const contactInfoSchema = {
  email: z.string()
    .min(1, validationMessages.required.email)
    .email(validationMessages.format.email),
  phone_number: z.string()
    .optional()
    .refine((val) => !val || validationUtils.phoneNumber(val), {
      message: validationMessages.format.phone
    }),
};

const addressSchema = {
  street_address: z.string().min(1, validationMessages.required.address_required),
  city: z.string().min(1, "City is required"),
  state_province: z.string().min(1, "State/Province is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string({
    required_error: validationMessages.required.country,
  }).min(1, validationMessages.required.country),
};

const personSchema = {
  first_name: z.string().min(2, validationMessages.length.min_name),
  last_name: z.string().min(2, validationMessages.length.min_name),
};

const preferenceSchema = {
  language_preference: z.string().optional(),
  timezone: z.string({
    required_error: validationMessages.required.timezone,
  }).min(1, validationMessages.required.timezone),
};

// Base schema composition
const baseSchema = {
  ...personSchema,
  ...contactInfoSchema,
  ...addressSchema,
  ...preferenceSchema,
  id: z.string().optional()
};

// Customer type-specific schemas
const personalSchema = z.object({
  ...baseSchema,
  customer_type: z.literal("Personal"),
  company_name: z.string().optional(),
  business_classification_id: z.string().optional(),
  company_size: z.string().optional(),
  fleet_details: z.any().optional()
});

const businessSchema = z.object({
  ...baseSchema,
  customer_type: z.literal("Business"),
  company_name: z.string().min(2, validationMessages.length.company_name),
  business_classification_id: z.string().min(1, validationMessages.required.business_classification_id),
  company_size: z.string().min(1, validationMessages.required.company_size),
  fleet_details: z.any().optional()
});

const fleetDetailsSchema = z.object({
  account_number: z.string().optional(),
  vehicle_count: z.number().min(1, "Number of vehicles is required"),
  manager_name: z.string().min(1, "Fleet manager name is required"),
  manager_contact: z.string().min(1, "Manager contact is required"),
  service_schedule: z.string().optional()
}).optional();

const fleetSchema = z.object({
  ...baseSchema,
  customer_type: z.literal("Fleet"),
  company_name: z.string().min(2, "Fleet name is required"),
  business_classification_id: z.string().optional(),
  company_size: z.string().optional(),
  fleet_details: fleetDetailsSchema,
});

// Combined schema using discriminated union
export const customerFormSchema = z.discriminatedUnion("customer_type", [
  personalSchema,
  businessSchema,
  fleetSchema
]);

// Validation helpers
export const debouncedValidation = (data: unknown) => {
  return customerFormSchema.safeParse(data);
};

export const customerValidationSchema = customerFormSchema;

// Type exports for better type safety
export type CustomerFormSchema = z.infer<typeof customerFormSchema>;
export type PersonalCustomerSchema = z.infer<typeof personalSchema>;
export type BusinessCustomerSchema = z.infer<typeof businessSchema>;
export type FleetCustomerSchema = z.infer<typeof fleetSchema>;
