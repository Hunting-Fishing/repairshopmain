
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { CustomerAddressFields } from "../CustomerAddressFields";

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
      <CustomerAddressFields 
        form={form} 
        isModernTheme={isModernTheme}
        required={true}
      />
    </FormSection>
  );
}
