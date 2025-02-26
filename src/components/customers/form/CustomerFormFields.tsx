
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormInput } from "./fields/FormInput";
import { CustomerTypeSelect } from "./fields/CustomerTypeSelect";
import { FormSection } from "./FormSection";

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
  return (
    <div className="space-y-8">
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
