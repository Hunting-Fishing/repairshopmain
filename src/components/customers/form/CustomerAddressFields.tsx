
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { AddressSearchField } from "./address-fields/AddressSearchField";
import { AddressDetails } from "./address-fields/AddressDetails";

interface CustomerAddressFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
  addressIndex?: number;
}

export function CustomerAddressFields({ 
  form, 
  isModernTheme = false,
  addressIndex
}: CustomerAddressFieldsProps) {
  return (
    <div className="space-y-4">
      <AddressSearchField 
        form={form} 
        isModernTheme={isModernTheme} 
        addressIndex={addressIndex} 
      />
      <AddressDetails 
        form={form} 
        isModernTheme={isModernTheme} 
        addressIndex={addressIndex} 
      />
    </div>
  );
}
