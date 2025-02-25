
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomerAddressFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

// Comprehensive list of countries with their ISO codes
const countries = [
  { id: "US", name: "United States" },
  { id: "CA", name: "Canada" },
  { id: "GB", name: "United Kingdom" },
  { id: "AU", name: "Australia" },
  { id: "NZ", name: "New Zealand" },
  { id: "FR", name: "France" },
  { id: "DE", name: "Germany" },
  { id: "JP", name: "Japan" },
  { id: "CN", name: "China" },
  { id: "IN", name: "India" },
  { id: "BR", name: "Brazil" },
  { id: "MX", name: "Mexico" },
  { id: "ES", name: "Spain" },
  { id: "IT", name: "Italy" },
  { id: "NL", name: "Netherlands" },
  { id: "SE", name: "Sweden" },
  { id: "NO", name: "Norway" },
  { id: "DK", name: "Denmark" },
  { id: "FI", name: "Finland" },
  { id: "IE", name: "Ireland" },
  { id: "SG", name: "Singapore" },
  { id: "KR", name: "South Korea" },
  { id: "ZA", name: "South Africa" },
  { id: "AE", name: "United Arab Emirates" },
  { id: "SA", name: "Saudi Arabia" },
  { id: "RU", name: "Russia" },
  { id: "CH", name: "Switzerland" },
  { id: "AT", name: "Austria" },
  { id: "BE", name: "Belgium" },
  { id: "PT", name: "Portugal" }
].sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by country name

export const CustomerAddressFields = ({ form, isModernTheme = false }: CustomerAddressFieldsProps) => {
  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white";

  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700";

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="street_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Street Address</FormLabel>
            <FormControl>
              <Input {...field} className={inputClasses} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
                <Input {...field} className={inputClasses} />
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
    </div>
  );
};
