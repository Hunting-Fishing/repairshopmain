
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormInput } from "./fields/FormInput";
import { CustomerTypeSelect } from "./fields/CustomerTypeSelect";

interface CustomerFormFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export const CustomerFormFields = ({ form, isModernTheme = false }: CustomerFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <CustomerTypeSelect 
        form={form} 
        isModernTheme={isModernTheme} 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          form={form}
          name="first_name"
          label="First Name"
          placeholder="Enter first name"
          isModernTheme={isModernTheme}
          required={true}
        />
        <FormInput
          form={form}
          name="last_name"
          label="Last Name"
          placeholder="Enter last name"
          isModernTheme={isModernTheme}
          required={true}
        />
      </div>
      
      <FormInput
        form={form}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter email address"
        isModernTheme={isModernTheme}
        required={true}
      />
      
      <FormInput
        form={form}
        name="phone_number"
        label="Phone Number"
        placeholder="Enter phone number"
        isModernTheme={isModernTheme}
      />
    </div>
  );
};
