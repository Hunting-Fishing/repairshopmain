
import { UseFormReturn, useFormContext } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validatePostalCode, getValidationMessage } from "../../schemas/addressValidationSchema";
import { normalizeAddress, isAddressComplete } from "../../utils/addressNormalization";
import { useEffect } from "react";
import { AddressErrorBoundary } from "./AddressErrorBoundary";
import { useToast } from "@/hooks/use-toast";

interface AddressDetailsProps {
  form: UseFormReturn<CustomerFormValues>;
  addressIndex?: number;
  isModernTheme?: boolean;
}

export function AddressDetails({ form, addressIndex, isModernTheme }: AddressDetailsProps) {
  const getFieldName = (field: keyof CustomerFormValues['address_book'][0]): `address_book.${number}.${keyof CustomerFormValues['address_book'][0]}` => {
    return `address_book.${addressIndex}.${field}` as const;
  };

  const { watch } = useFormContext();
  const { toast } = useToast();
  const country = watch(getFieldName("country"));

  // Normalize address fields on blur
  const handleBlur = (field: keyof CustomerFormValues['address_book'][0], value: string) => {
    try {
      const normalizedAddress = normalizeAddress({
        [field]: value
      });
      form.setValue(getFieldName(field), normalizedAddress[field], { 
        shouldValidate: true 
      });
    } catch (error) {
      console.error('Address normalization error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process address field. Please try again."
      });
    }
  };

  // Validate postal code when country changes
  useEffect(() => {
    const postalCode = form.getValues(getFieldName("postal_code"))?.toString();
    const countryValue = country?.toString();
    
    if (countryValue && postalCode) {
      const isValid = validatePostalCode(postalCode, countryValue);
      if (!isValid) {
        form.setError(getFieldName("postal_code"), {
          type: "manual",
          message: getValidationMessage("postal_code", countryValue)
        });
      } else {
        form.clearErrors(getFieldName("postal_code"));
      }
    }
  }, [country, form, getFieldName]);

  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white";

  return (
    <AddressErrorBoundary>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={getFieldName("city")}
          rules={{
            required: "City is required",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City*</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={field.value?.toString() || ''} 
                  className={inputClasses} 
                  placeholder="Enter city"
                  onBlur={(e) => {
                    field.onBlur();
                    handleBlur('city', e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={getFieldName("state_province")}
          rules={{
            required: "State/Province is required",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province*</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={field.value?.toString() || ''} 
                  className={inputClasses} 
                  placeholder="Enter state"
                  onBlur={(e) => {
                    field.onBlur();
                    handleBlur('state_province', e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={getFieldName("postal_code")}
          rules={{
            required: "Postal code is required",
            validate: (value) => {
              if (!country || !value) return "Country and postal code are required";
              const postalCodeStr = value.toString();
              const countryStr = country.toString();
              return validatePostalCode(postalCodeStr, countryStr) || 
                getValidationMessage("postal_code", countryStr);
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code*</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={field.value?.toString() || ''} 
                  className={inputClasses} 
                  placeholder="Enter postal code"
                  onBlur={(e) => {
                    field.onBlur();
                    handleBlur('postal_code', e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={getFieldName("country")}
          rules={{
            required: "Country is required",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country*</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={field.value?.toString() || ''} 
                  className={inputClasses} 
                  placeholder="Enter country"
                  onBlur={(e) => {
                    field.onBlur();
                    handleBlur('country', e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </AddressErrorBoundary>
  );
}
