
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddressLookup } from "@/hooks/useAddressLookup";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressSearchFieldProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
  addressIndex?: number;
}

export function AddressSearchField({ form, isModernTheme, addressIndex }: AddressSearchFieldProps) {
  const [search, setSearch] = useState("");
  const { suggestions, isLoading, error, updateSearch } = useAddressLookup(search);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateSearch(value);
  };

  const handleSelectAddress = (address: any) => {
    const formattedAddress = {
      street_address: `${address.address.house_number || ''} ${address.address.road || ''}`.trim(),
      city: address.address.city || '',
      state_province: address.address.state || '',
      postal_code: address.address.postcode || '',
      country: address.address.country || '',
    };

    if (addressIndex !== undefined) {
      Object.entries(formattedAddress).forEach(([key, value]) => {
        form.setValue(`address_book.${addressIndex}.${key}`, value);
      });
    } else {
      Object.entries(formattedAddress).forEach(([key, value]) => {
        form.setValue(key as keyof typeof formattedAddress, value);
      });
    }

    setSearch("");
  };

  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200"
    : "bg-white/80 border-gray-200/50";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Search Address</Label>
        <div className="relative">
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Start typing to search for an address..."
            className={cn(inputClasses, "pr-10")}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions && suggestions.length > 0 && search && (
        <div className="rounded-md border bg-white p-2 shadow-sm">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left text-sm"
              onClick={() => handleSelectAddress(suggestion)}
            >
              {suggestion.display_name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
