
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";

interface AddressFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  inputClasses: string;
  labelClasses: string;
  selectedCountry?: string;
  postalCodePattern?: string;
  countries: Array<{ id: string; name: string; }>;
}

export const AddressFields = ({ 
  form, 
  inputClasses, 
  labelClasses,
  selectedCountry,
  postalCodePattern,
  countries 
}: AddressFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>City</FormLabel>
              <FormControl>
                <Input {...field} className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state_province"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>State/Province</FormLabel>
              <FormControl>
                <Input {...field} className={inputClasses} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Postal Code</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className={inputClasses}
                  pattern={postalCodePattern}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Country</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-80">
                    {countries.map((country) => (
                      <SelectItem 
                        key={country.id} 
                        value={country.id}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
