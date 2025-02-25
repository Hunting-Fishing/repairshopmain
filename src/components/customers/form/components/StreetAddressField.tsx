
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { AddressLookup } from "./AddressLookup";
import { NominatimResult } from "../types/addressTypes";

interface StreetAddressFieldProps {
  form: UseFormReturn<CustomerFormValues>;
  inputClasses: string;
  labelClasses: string;
  addressType: string;
  isManualEntry: boolean;
  isSearching: boolean;
  suggestions: NominatimResult[];
  onAddressSelect: (result: NominatimResult) => void;
}

export const StreetAddressField = ({
  form,
  inputClasses,
  labelClasses,
  addressType,
  isManualEntry,
  isSearching,
  suggestions,
  onAddressSelect
}: StreetAddressFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="street_address"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClasses}>
            {addressType === 'po_box' ? 'PO Box Number' : 'Street Address'}
            {isManualEntry && addressType !== 'po_box' && " (Suite, Unit, etc. accepted)"}
          </FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                {...field} 
                className={inputClasses}
                placeholder={
                  addressType === 'po_box' 
                    ? "Enter PO Box number" 
                    : isManualEntry 
                      ? "Enter complete address" 
                      : "Start typing to search address"
                }
              />
            </FormControl>
            {!isManualEntry && addressType !== 'po_box' && (
              <AddressLookup 
                isSearching={isSearching}
                suggestions={suggestions}
                onSelect={onAddressSelect}
              />
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
