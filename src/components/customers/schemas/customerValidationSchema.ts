
import * as z from "zod";

export const customerValidationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional()
    .refine((val) => !val || /^\+?[\d\s-]{10,}$/.test(val), {
      message: "Invalid phone number format"
    }),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state_province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  customer_type: z.enum(["Personal", "Fleet", "Business"]),
  language_preference: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  address_book: z.array(z.object({
    type: z.string(),
    street_address: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state_province: z.string().min(1, "State/Province is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required")
  })).optional(),
}).refine((data) => {
  if (data.customer_type === "Business") {
    return !!data.business_classification_id;
  }
  return true;
}, {
  message: "Business classification is required for business customers",
  path: ["business_classification_id"]
});
