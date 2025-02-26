
import * as z from "zod";
import { validationMessages } from "./validationMessages";
import { debounce } from "lodash";

export const secondaryContactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(validationMessages.format.email).optional().nullable(),
  phone: z.string()
    .optional()
    .nullable()
    .refine((val) => !val || /^\+?[\d\s-]{10,}$/.test(val), {
      message: validationMessages.format.phone
    }),
  relationship: z.string().optional()
});

export const addressSchema = z.object({
  type: z.string(),
  street_address: z.string().min(1, validationMessages.required.street_address),
  city: z.string().min(1, validationMessages.required.city),
  state_province: z.string().min(1, validationMessages.required.state_province),
  postal_code: z.string().min(1, validationMessages.required.postal_code),
  country: z.string().min(1, validationMessages.required.country)
});

export const customerValidationSchema = z.object({
  first_name: z.string().min(1, validationMessages.required.first_name),
  last_name: z.string().min(1, validationMessages.required.last_name),
  email: z.string().email(validationMessages.format.email),
  phone_number: z.string().optional()
    .refine((val) => !val || /^\+?[\d\s-]{10,}$/.test(val), {
      message: validationMessages.format.phone
    }),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(1, validationMessages.required.country),
  customer_type: z.enum(["Personal", "Fleet", "Business"]),
  language_preference: z.string().optional(),
  timezone: z.string().min(1, validationMessages.required.timezone),
  business_classification_id: z.string().optional(),
  secondary_contact: secondaryContactSchema.optional(),
  address_book: z.array(addressSchema).optional(),
}).refine((data) => {
  if (data.customer_type === "Business") {
    return !!data.business_classification_id;
  }
  return true;
}, {
  message: validationMessages.required.business_classification_id,
  path: ["business_classification_id"]
}).refine(async (data) => {
  if (!data.email) return true;
  
  // Check for duplicate email
  const { data: existingCustomer, error } = await supabase
    .from('customers')
    .select('id, email')
    .eq('email', data.email)
    .maybeSingle();

  if (error) throw error;
  return !existingCustomer || existingCustomer.id === data.id;
}, {
  message: "Email address is already in use",
  path: ["email"]
});

export const debouncedValidation = debounce((schema: z.ZodSchema, data: any) => {
  return schema.parseAsync(data);
}, 300);
