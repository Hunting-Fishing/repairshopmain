
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormInput } from "../fields/FormInput";
import { FormSelect } from "../fields/FormSelect";

interface AdditionalDetailsSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
  requiredFields: string[];
}

export function AdditionalDetailsSection({
  form,
  isModernTheme = false,
  requiredFields = [],
}: AdditionalDetailsSectionProps) {
  const customerType = form.watch("customer_type");

  return (
    <FormSection 
      title={`${customerType} Details`}
      description={`Enter additional details for this ${customerType.toLowerCase()} customer`}
      isModernTheme={isModernTheme}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          form={form}
          name="company_name"
          label="Company Name"
          placeholder="Enter company name"
          required={requiredFields.includes("company_name")}
          isModernTheme={isModernTheme}
        />

        {customerType === "Business" && (
          <>
            <FormSelect
              form={form}
              name="business_classification_id"
              label="Business Classification"
              placeholder="Select business classification"
              required={requiredFields.includes("business_classification_id")}
              isModernTheme={isModernTheme}
              options={[
                { value: "small", label: "Small Business" },
                { value: "medium", label: "Medium Business" },
                { value: "large", label: "Large Enterprise" }
              ]}
            />

            <FormInput
              form={form}
              name="company_size"
              label="Company Size"
              placeholder="Enter company size"
              required={requiredFields.includes("company_size")}
              isModernTheme={isModernTheme}
            />
          </>
        )}

        {customerType === "Fleet" && (
          <>
            <FormInput
              form={form}
              name="fleet_details.vehicle_count"
              label="Number of Vehicles"
              placeholder="Enter number of vehicles"
              type="number"
              required
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="fleet_details.manager_name"
              label="Fleet Manager Name"
              placeholder="Enter fleet manager name"
              required
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="fleet_details.manager_contact"
              label="Manager Contact"
              placeholder="Enter manager contact"
              required
              isModernTheme={isModernTheme}
            />
          </>
        )}
      </div>
    </FormSection>
  );
}
