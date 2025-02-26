
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { CustomerTypeSelect } from "../fields/CustomerTypeSelect";

interface CustomerTypeSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function CustomerTypeSection({
  form,
  isModernTheme = false,
}: CustomerTypeSectionProps) {
  return (
    <FormSection 
      title="Customer Type" 
      description="Select the type of customer and related information"
      isModernTheme={isModernTheme}
    >
      <div className="space-y-6">
        <CustomerTypeSelect 
          form={form} 
          isModernTheme={isModernTheme} 
        />
      </div>
    </FormSection>
  );
}
