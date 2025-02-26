
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { debounce } from "lodash";

// First, let's define our validation messages
export const validationMessages = {
  required: {
    first_name: "First name is required",
    last_name: "Last name is required",
    email: "Email is required",
    country: "Country is required",
    timezone: "Timezone is required",
    business_classification_id: "Business classification is required for business customers",
    street_address: "Street address is required",
    city: "City is required",
    state_province: "State/Province is required",
    postal_code: "Postal code is required"
  },
  format: {
    email: "Please enter a valid email address",
    phone: "Please enter a valid phone number"
  }
};

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

// Define the base schema type that includes all possible fields
const customerBaseSchema = {
  id: z.string().optional(),
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
  address_book: z.array(addressSchema).optional()
};

export const customerValidationSchema = z.object(customerBaseSchema)
  .refine((data) => {
    if (data.customer_type === "Business") {
      return !!data.business_classification_id;
    }
    return true;
  }, {
    message: validationMessages.required.business_classification_id,
    path: ["business_classification_id"]
  })
  .refine(async (data) => {
    if (!data.email || !data.id) return true;
    
    // Check for duplicate email, excluding current customer
    const { data: existingCustomer, error } = await supabase
      .from('customers')
      .select('id, email')
      .eq('email', data.email)
      .neq('id', data.id)
      .maybeSingle();

    if (error) throw error;
    return !existingCustomer;
  }, {
    message: "Email address is already in use",
    path: ["email"]
  });

export const debouncedValidation = debounce((schema: z.ZodSchema, data: any) => {
  return schema.parseAsync(data);
}, 300);
