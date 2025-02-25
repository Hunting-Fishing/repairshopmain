
import * as z from "zod";
import { validationMessages } from "./validationMessages";

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
  marketing_preferences: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    phone: z.boolean().optional()
  }).optional(),
  company_size: z.string().optional(),
  business_classification_id: z.string().optional(),
  secondary_contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email(validationMessages.format.email).optional(),
    relationship: z.string().optional()
  }).optional(),
  id: z.string().optional()
});
