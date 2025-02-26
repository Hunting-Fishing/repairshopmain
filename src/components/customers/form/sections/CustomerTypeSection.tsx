
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { CustomerTypeSelect } from "../fields/CustomerTypeSelect";
import { FormInput } from "../fields/FormInput";

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

        {form.watch("customer_type") === "Business" && (
          <>
            <FormInput
              form={form}
              name="company_name"
              label="Company Name"
              placeholder="Enter company name"
              helpText="Legal business name as registered"
              required
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="company_size"
              label="Company Size"
              placeholder="Enter number of employees"
              helpText="Approximate number of employees in the organization"
              isModernTheme={isModernTheme}
            />
          </>
        )}
      </div>
    </FormSection>
  );
}
