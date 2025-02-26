import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormInput } from "./fields/FormInput";
import { CustomerTypeSelect } from "./fields/CustomerTypeSelect";
import { FormSection } from "./FormSection";
import { AddressBookSection } from "./sections/AddressBookSection";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useCustomerDataSave } from "../hooks/useCustomerDataSave";
import { SocialProfilesSection } from "./sections/SocialProfilesSection";

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
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-2 flex justify-between items-center">
          <h3 className="text-sm font-medium">Profile Completeness</h3>
          <span className="text-sm text-muted-foreground">{Math.round(completeness.score)}%</span>
        </div>
        <Progress value={completeness.score} className="h-2" />
        {completeness.recommendations.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">Recommendations:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {completeness.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

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
