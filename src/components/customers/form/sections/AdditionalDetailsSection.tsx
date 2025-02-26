
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormInput } from "../fields/FormInput";

interface AdditionalDetailsSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function AdditionalDetailsSection({
  form,
  isModernTheme = false,
}: AdditionalDetailsSectionProps) {
  return (
    <FormSection 
      title="Additional Details" 
      description="Optional information to better serve the customer"
      defaultExpanded={false}
      isModernTheme={isModernTheme}
    >
      <div className="space-y-6">
        <FormInput
          form={form}
          name="notes"
          label="Notes"
          placeholder="Enter any additional notes"
          helpText="Internal notes about the customer (not visible to them)"
          isModernTheme={isModernTheme}
        />
      </div>
    </FormSection>
  );
}
