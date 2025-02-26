
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormInput } from "./fields/FormInput";
import { MapPin, Building2, Globe } from "lucide-react";

interface CustomerAddressFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
  required?: boolean;
}

export function CustomerAddressFields({
  form,
  isModernTheme = false,
  required = false
}: CustomerAddressFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name="street_address"
        label="Street Address"
        placeholder="Enter street address"
        icon={<MapPin className="h-4 w-4 text-gray-500" />}
        required={required}
        isModernTheme={isModernTheme}
      />
      <FormInput
        form={form}
        name="city"
        label="City"
        placeholder="Enter city"
        icon={<Building2 className="h-4 w-4 text-gray-500" />}
        required={required}
        isModernTheme={isModernTheme}
      />
      <FormInput
        form={form}
        name="state_province"
        label="State/Province"
        placeholder="Enter state or province"
        required={required}
        isModernTheme={isModernTheme}
      />
      <FormInput
        form={form}
        name="postal_code"
        label="Postal Code"
        placeholder="Enter postal code"
        required={required}
        isModernTheme={isModernTheme}
      />
      <FormInput
        form={form}
        name="country"
        label="Country"
        placeholder="Enter country"
        icon={<Globe className="h-4 w-4 text-gray-500" />}
        required={required}
        isModernTheme={isModernTheme}
      />
    </div>
  );
}
