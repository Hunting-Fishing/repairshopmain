
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormInput } from "../fields/FormInput";
import { FormSection } from "../FormSection";

interface BasicInformationSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function BasicInformationSection({
  form,
  isModernTheme = false,
}: BasicInformationSectionProps) {
  return (
    <FormSection 
      title="Basic Information" 
      description="Enter the customer's basic contact information"
      isModernTheme={isModernTheme}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          form={form}
          name="first_name"
          label="First Name"
          placeholder="Enter first name"
          helpText="Customer's legal first name as it appears on official documents"
          required
          isModernTheme={isModernTheme}
        />
        <FormInput
          form={form}
          name="last_name"
          label="Last Name"
          placeholder="Enter last name"
          helpText="Customer's legal last name as it appears on official documents"
          required
          isModernTheme={isModernTheme}
        />
      </div>

      <div className="mt-6">
        <FormInput
          form={form}
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          helpText="Primary email address for communications and notifications"
          required
          isModernTheme={isModernTheme}
        />
      </div>

      <div className="mt-6">
        <FormInput
          form={form}
          name="phone_number"
          label="Phone Number"
          placeholder="Enter phone number"
          helpText="Primary contact number for important communications"
          isModernTheme={isModernTheme}
        />
      </div>
    </FormSection>
  );
}
