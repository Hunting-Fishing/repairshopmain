import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { AddressFields } from "./components/AddressFields";
import { StreetAddressField } from "./components/StreetAddressField";
import { ADDRESS_TYPES, CustomerAddressFieldsProps, NominatimResult } from "./types/addressTypes";
import { getPostalCodePattern } from "./utils/addressUtils";

// Comprehensive list of countries
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
].sort((a, b) => a.name.localeCompare(b.name));

export const CustomerAddressFields = ({ form, isModernTheme = false }: CustomerAddressFieldsProps) => {
  const [addressSuggestions, setAddressSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [addressType, setAddressType] = useState<typeof ADDRESS_TYPES[number]['id']>('residential');

  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white";

  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700";

  const selectedCountry = useWatch({ control: form.control, name: "country" });
  const streetAddress = useWatch({ control: form.control, name: "street_address" });

  const handleAddressSelect = (result: NominatimResult) => {
    const { address } = result;
    form.setValue('street_address', addressType === 'po_box' ? '' : 
      `${address.house_number || ''} ${address.road || ''}`.trim());
    form.setValue('city', address.city || '');
    form.setValue('state_province', address.state || '');
    form.setValue('postal_code', address.postcode || '');
    form.setValue('country', address.country_code?.toUpperCase() || '');
    setAddressSuggestions([]);
  };

  const handleAddressLookup = async (input: string) => {
    if (!input || isManualEntry) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&addressdetails=1`,
        { headers: { 'Accept': 'application/json', 'User-Agent': 'CustomerManagementSystem' } }
      );
      if (response.ok) {
        setAddressSuggestions(await response.json());
      }
    } catch (error) {
      console.error('Address search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedGetSuggestions = debounce(handleAddressLookup, 500);

  useEffect(() => {
    if (streetAddress && !isManualEntry) {
      debouncedGetSuggestions(streetAddress);
    } else {
      setAddressSuggestions([]);
    }
    return () => debouncedGetSuggestions.cancel();
  }, [streetAddress, isManualEntry]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <Select value={addressType} onValueChange={(type) => {
          setAddressType(type as typeof ADDRESS_TYPES[number]['id']);
          setIsManualEntry(type === 'po_box');
          setAddressSuggestions([]);
        }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select address type" />
          </SelectTrigger>
          <SelectContent>
            {ADDRESS_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {addressType !== 'po_box' && (
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
        )}
      </div>

      <StreetAddressField
        form={form}
        inputClasses={inputClasses}
        labelClasses={labelClasses}
        addressType={addressType}
        isManualEntry={isManualEntry}
        isSearching={isSearching}
        suggestions={addressSuggestions}
        onAddressSelect={handleAddressSelect}
      />
      
      <AddressFields 
        form={form}
        inputClasses={inputClasses}
        labelClasses={labelClasses}
        selectedCountry={selectedCountry}
        postalCodePattern={selectedCountry ? getPostalCodePattern(selectedCountry) : undefined}
        countries={countries}
      />
    </div>
  );
};
