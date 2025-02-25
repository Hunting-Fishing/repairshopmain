import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn, useWatch } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import debounce from "lodash/debounce";

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

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceResult {
  address_components: AddressComponent[];
  formatted_address: string;
}

export const CustomerAddressFields = ({ form, isModernTheme = false }: CustomerAddressFieldsProps) => {
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white";

  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700";

  // Watch the street_address field for changes
  const streetAddress = useWatch({
    control: form.control,
    name: "street_address"
  });

  // Function to get address suggestions
  const getAddressSuggestions = async (input: string) => {
    if (!input) return;
    setIsSearching(true);
    
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ address: input });
      
      if (response.results) {
        const suggestions = response.results.map(result => result.formatted_address);
        setAddressSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce the address lookup
  const debouncedGetSuggestions = debounce(getAddressSuggestions, 500);

  // Handle address selection
  const handleAddressSelect = async (address: string) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ address });
      
      if (response.results?.[0]) {
        const result = response.results[0] as PlaceResult;
        const addressComponents = result.address_components;
        
        // Helper function to find address component by type
        const findComponent = (type: string) => 
          addressComponents.find(component => component.types.includes(type));

        // Extract address components
        const streetNumber = findComponent('street_number')?.long_name || '';
        const route = findComponent('route')?.long_name || '';
        const city = findComponent('locality')?.long_name || findComponent('administrative_area_level_2')?.long_name || '';
        const state = findComponent('administrative_area_level_1')?.short_name || '';
        const country = findComponent('country')?.short_name || '';
        const postalCode = findComponent('postal_code')?.long_name || '';

        // Update form values
        form.setValue('street_address', `${streetNumber} ${route}`.trim());
        form.setValue('city', city);
        form.setValue('state_province', state);
        form.setValue('postal_code', postalCode);
        form.setValue('country', country);

        // Clear suggestions
        setAddressSuggestions([]);
      }
    } catch (error) {
      console.error('Error selecting address:', error);
    }
  };

  useEffect(() => {
    if (streetAddress) {
      debouncedGetSuggestions(streetAddress);
    } else {
      setAddressSuggestions([]);
    }

    return () => {
      debouncedGetSuggestions.cancel();
    };
  }, [streetAddress]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>Street Address</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input {...field} className={inputClasses} />
                </FormControl>
                {isSearching && (
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground animate-spin" />
                )}
              </div>
              {addressSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  <ScrollArea className="max-h-[200px]">
                    {addressSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </ScrollArea>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
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
