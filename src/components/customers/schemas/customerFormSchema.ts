
import * as z from "zod";

export const customerFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string({
    required_error: "Country is required",
  }).min(1, "Country is required"),
  customer_type: z.enum(["Personal", "Fleet", "Business"]),
  language_preference: z.string().optional(),
  timezone: z.string({
    required_error: "Timezone is required",
  }).min(1, "Please select a timezone"),
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
    email: z.string().email("Invalid email address").optional(),
    relationship: z.string().optional()
  }).optional(),
  id: z.string().optional()
});
