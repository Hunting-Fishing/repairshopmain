
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AddressDetailsProps {
  form: UseFormReturn<CustomerFormValues>;
  addressIndex?: number;
  isModernTheme?: boolean;
}

export function AddressDetails({ form, addressIndex, isModernTheme }: AddressDetailsProps) {
  const getFieldName = (field: keyof CustomerFormValues['address_book'][0]): `address_book.${number}.${keyof CustomerFormValues['address_book'][0]}` => {
    return `address_book.${addressIndex}.${field}` as const;
  };

  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white";

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={getFieldName("city")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={field.value?.toString() || ''} 
                className={inputClasses} 
                placeholder="Enter city" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={getFieldName("state_province")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>State/Province</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={field.value?.toString() || ''} 
                className={inputClasses} 
                placeholder="Enter state" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={getFieldName("postal_code")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal Code</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={field.value?.toString() || ''} 
                className={inputClasses} 
                placeholder="Enter postal code" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={getFieldName("country")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={field.value?.toString() || ''} 
                className={inputClasses} 
                placeholder="Enter country" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
