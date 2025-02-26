
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormInput } from "../fields/FormInput";
import { Mail, Phone, User } from "lucide-react";

interface BasicInformationSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function BasicInformationSection({
  form,
  isModernTheme = false,
}: BasicInformationSectionProps) {
  return (
    <FormSection 
      title="Basic Information" 
      description="Enter the customer's basic contact information"
      isModernTheme={isModernTheme}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormInput
          form={form}
          name="first_name"
          label="First Name"
          required
          placeholder="Enter first name"
          icon={<User className="h-4 w-4 text-gray-500" />}
          isModernTheme={isModernTheme}
        />
        <FormInput
          form={form}
          name="last_name"
          label="Last Name"
          required
          placeholder="Enter last name"
          icon={<User className="h-4 w-4 text-gray-500" />}
          isModernTheme={isModernTheme}
        />
        <FormInput
          form={form}
          name="email"
          label="Email"
          type="email"
          required
          placeholder="Enter email address"
          icon={<Mail className="h-4 w-4 text-gray-500" />}
          isModernTheme={isModernTheme}
        />
        <FormInput
          form={form}
          name="phone_number"
          label="Phone Number"
          placeholder="Enter phone number"
          icon={<Phone className="h-4 w-4 text-gray-500" />}
          isModernTheme={isModernTheme}
        />
      </div>
    </FormSection>
  );
}
