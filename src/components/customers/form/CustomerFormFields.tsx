
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { CustomerTypeSelect } from "./fields/CustomerTypeSelect";
import { FormSection } from "./FormSection";
import { AddressBookSection } from "./sections/AddressBookSection";
import { useEffect, useState } from "react";
import { useCustomerDataSave } from "../hooks/useCustomerDataSave";
import { SocialProfilesSection } from "./sections/SocialProfilesSection";
import { ProfileCompletenessSection } from "./sections/ProfileCompletenessSection";
import { BasicInformationSection } from "./sections/BasicInformationSection";
import { FormInput } from "./fields/FormInput";

interface CustomerFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  customerId: string;
  isModernTheme?: boolean;
}

export function CustomerFormFields({
  form,
  customerId,
  isModernTheme = false,
}: CustomerFormFieldsProps) {
  const [completeness, setCompleteness] = useState({ score: 0, recommendations: [] });
  const { calculateProfileCompleteness } = useCustomerDataSave(customerId);

  useEffect(() => {
    const subscription = form.watch((data) => {
      const result = calculateProfileCompleteness(data as CustomerFormValues);
      setCompleteness({
        score: result.score,
        recommendations: result.recommendations
      });
    });

    return () => subscription.unsubscribe();
  }, [form, calculateProfileCompleteness]);

  return (
    <div className="space-y-8">
      <ProfileCompletenessSection 
        score={completeness.score}
        recommendations={completeness.recommendations}
      />

      <BasicInformationSection form={form} isModernTheme={isModernTheme} />

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

      <SocialProfilesSection form={form} isModernTheme={isModernTheme} />

      <AddressBookSection 
        form={form}
        isModernTheme={isModernTheme}
      />

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
    </div>
  );
}
