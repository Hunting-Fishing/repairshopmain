
export const validationMessages = {
  required: {
    first_name: "First name is required",
    last_name: "Last name is required",
    email: "Email address is required",
    country: "Country is required",
    timezone: "Timezone is required",
    customer_type: "Customer type is required",
    company_size: "Company size is required for business customers",
    business_classification_id: "Business classification is required for business customers",
    company_name: "Company name is required for business customers",
    phone_number: "Phone number is required"
  },
  format: {
    email: "Please enter a valid email address",
    phone: "Please enter a valid phone number",
    postal_code: "Please enter a valid postal code"
  },
  length: {
    min_name: "Must be at least 2 characters",
    max_name: "Must be less than 50 characters",
    phone: "Phone number must be between 10 and 15 digits",
    company_name: "Company name must be between 2 and 100 characters"
  },
  custom: {
    address_required: "Address is required for business customers",
    secondary_contact: "Secondary contact information is incomplete",
    phone_region_mismatch: "Phone number does not match the selected region",
    fleet_requirements: "Fleet customers require company name and complete contact information",
    invalid_phone_format: "Invalid phone number format for the selected region"
  }
};
