
import * as z from "zod";

export const customerFormSchema = z.object({
  first_name: z.string()
    .min(3, "First name must be at least 3 characters")
    .max(50, "First name must be less than 50 characters"),
  last_name: z.string()
    .min(3, "Last name must be at least 3 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string()
    .min(5, "Email must be at least 5 characters")
    .max(80, "Email must be less than 80 characters")
    .email("Invalid email format"),
  phone_number: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  customer_type: z.enum(["Personal", "Fleet", "Business"]),
  language_preference: z.string().optional(),
  timezone: z.string().optional()
    .refine((val) => {
      if (!val) return true;
      try {
        new Date().toLocaleString('en-US', { timeZone: val });
        return true;
      } catch {
        return false;
      }
    }, "Invalid timezone"),
  company_size: z.string().optional(),
  business_classification_id: z.string().optional(),
  preferred_contact_time: z.object({
    start: z.string(),
    end: z.string()
  }).optional(),
  secondary_contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    relationship: z.string().optional()
  }).optional(),
  marketing_preferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    phone: z.boolean()
  }).optional()
});
