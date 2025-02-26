
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormInput } from "./fields/FormInput";
import { MapPin, Building2, Globe } from "lucide-react";

// Define paths type for nested object access
type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

interface CustomerAddressFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
  required?: boolean;
  addressIndex?: number;
}

export function CustomerAddressFields({
  form,
  isModernTheme = false,
  required = false,
  addressIndex
}: CustomerAddressFieldsProps) {
  // Helper function to get the correct field name based on whether we're dealing with an address book entry
  const getFieldName = (field: keyof CustomerFormValues | string): Path<CustomerFormValues> => {
    if (typeof addressIndex === 'number') {
      return `address_book.${addressIndex}.${field}` as Path<CustomerFormValues>;
    }
    return field as keyof CustomerFormValues;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name={getFieldName("street_address")}
        label="Street Address"
        placeholder="Enter street address"
        icon={<MapPin className="h-4 w-4 text-gray-500" />}
        required={required}
        isModernTheme={isModernTheme}
      />
      <FormInput
        form={form}
        name={getFieldName("city")}
        label="City"
        placeholder="Enter city"
        icon={<Building2 className="h-4 w-4 text-gray-500" />}
        required={required}
        isModernTheme={isModernTheme}
      />
      <FormInput
        form={form}
        name={getFieldName("state_province")}
        label="State/Province"
        placeholder="Enter state or province"
        required={required}
        isModernTheme={isModernTheme}
      />
      <FormInput
        form={form}
        name={getFieldName("postal_code")}
        label="Postal Code"
        placeholder="Enter postal code"
        required={required}
        isModernTheme={isModernTheme}
      />
      <FormInput
        form={form}
        name={getFieldName("country")}
        label="Country"
        placeholder="Enter country"
        icon={<Globe className="h-4 w-4 text-gray-500" />}
        required={required}
        isModernTheme={isModernTheme}
      />
    </div>
  );
}
