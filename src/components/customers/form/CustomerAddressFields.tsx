
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

interface NominatimResult {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
  };
}

export const CustomerAddressFields = ({ form, isModernTheme = false }: CustomerAddressFieldsProps) => {
  const [addressSuggestions, setAddressSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);

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
    if (!input || isManualEntry) return;
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CustomerManagementSystem'
          }
        }
      );
      
      if (response.ok) {
        const results: NominatimResult[] = await response.json();
        setAddressSuggestions(results);
      }
    } catch (error) {
      console.error('Address search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce the address lookup
  const debouncedGetSuggestions = debounce(getAddressSuggestions, 500);

  // Handle address selection
  const handleAddressSelect = (result: NominatimResult) => {
    const { address } = result;
    
    // Construct street address
    const streetNumber = address.house_number || '';
    const street = address.road || '';
    const streetAddress = `${streetNumber} ${street}`.trim();

    // Update form values
    form.setValue('street_address', streetAddress);
    form.setValue('city', address.city || '');
    form.setValue('state_province', address.state || '');
    form.setValue('postal_code', address.postcode || '');
    form.setValue('country', address.country_code?.toUpperCase() || '');

    // Clear suggestions
    setAddressSuggestions([]);
  };

  useEffect(() => {
    if (streetAddress && !isManualEntry) {
      debouncedGetSuggestions(streetAddress);
    } else {
      setAddressSuggestions([]);
    }

    return () => {
      debouncedGetSuggestions.cancel();
    };
  }, [streetAddress, isManualEntry]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsManualEntry(!isManualEntry);
            setAddressSuggestions([]);
          }}
          className="text-sm"
        >
          {isManualEntry ? "Use Address Lookup" : "Enter Address Manually"}
        </Button>
      </div>

      <div className="relative">
        <FormField
          control={form.control}
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClasses}>
                Street Address {isManualEntry && "(PO Box, Suite, etc. accepted)"}
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    {...field} 
                    className={inputClasses}
                    placeholder={isManualEntry ? "Enter complete address (PO Box, Suite, etc.)" : "Start typing to search address"}
                  />
                </FormControl>
                {!isManualEntry && isSearching && (
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground animate-spin" />
                )}
              </div>
              {!isManualEntry && addressSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  <ScrollArea className="max-h-[200px]">
                    {addressSuggestions.map((result, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleAddressSelect(result)}
                      >
                        {result.display_name}
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
