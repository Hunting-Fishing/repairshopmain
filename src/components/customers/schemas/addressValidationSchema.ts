
import * as z from "zod";

const postalCodePatterns: Record<string, RegExp> = {
  US: /^\d{5}(-\d{4})?$/,
  CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  UK: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
  // Add more country patterns as needed
};

const getPostalCodePattern = (country: string) => {
  return postalCodePatterns[country] || /^[A-Za-z0-9\s-]{3,10}$/; // Default pattern
};

export const addressSchema = z.object({
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state_province: z.string().min(1, "State/Province is required"),
  postal_code: z.string()
    .min(1, "Postal code is required")
    .refine((val) => true, { // Will be refined based on country
      message: "Invalid postal code format"
    }),
  country: z.string().min(1, "Country is required"),
  type: z.enum(["home", "work", "other"]).default("home"),
  is_primary: z.boolean().default(false)
});

export const addressBookSchema = z.array(addressSchema)
  .refine((addresses) => {
    // Ensure exactly one primary address
    const primaryAddresses = addresses.filter(addr => addr.is_primary);
    return primaryAddresses.length === 1;
  }, {
    message: "There must be exactly one primary address"
  });

// For runtime validation of postal codes
export const validatePostalCode = (postalCode: string, country: string): boolean => {
  const pattern = getPostalCodePattern(country);
  return pattern.test(postalCode);
};

export const getValidationMessage = (field: string, country?: string): string => {
  const messages: Record<string, string> = {
    street_address: "Please enter a valid street address",
    city: "Please enter a valid city name",
    state_province: "Please enter a valid state or province",
    postal_code: country ? `Please enter a valid postal code for ${country}` : "Please enter a valid postal code",
    country: "Please select a valid country",
  };
  return messages[field] || "Invalid value";
};
