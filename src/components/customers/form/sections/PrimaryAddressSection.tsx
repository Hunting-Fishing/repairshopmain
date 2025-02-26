
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormInput } from "../fields/FormInput";

interface PrimaryAddressSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function PrimaryAddressSection({
  form,
  isModernTheme = false,
}: PrimaryAddressSectionProps) {
  return (
    <FormSection 
      title="Primary Address" 
      description="Enter the customer's primary address information"
      isModernTheme={isModernTheme}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          form={form}
          name="street_address"
          label="Street Address"
          placeholder="Enter street address"
          isModernTheme={isModernTheme}
        />
        <FormInput
          form={form}
          name="city"
          label="City"
          placeholder="Enter city"
          isModernTheme={isModernTheme}
        />
        <FormInput
          form={form}
          name="state_province"
          label="State/Province"
          placeholder="Enter state or province"
          isModernTheme={isModernTheme}
        />
        <FormInput
          form={form}
          name="postal_code"
          label="Postal Code"
          placeholder="Enter postal code"
          isModernTheme={isModernTheme}
        />
        <FormInput
          form={form}
          name="country"
          label="Country"
          placeholder="Enter country"
          isModernTheme={isModernTheme}
        />
      </div>
    </FormSection>
  );
}
