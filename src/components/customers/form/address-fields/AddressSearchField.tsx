
import { useAddressLookup } from "@/hooks/useAddressLookup";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";

interface AddressSearchFieldProps {
  form: UseFormReturn<CustomerFormValues>;
  addressIndex?: number;
  isModernTheme?: boolean;
}

export function AddressSearchField({ form, addressIndex, isModernTheme }: AddressSearchFieldProps) {
  const [addressSearch, setAddressSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { suggestions, isLoading, updateSearch } = useAddressLookup(addressSearch);

  const getFieldName = (field: keyof CustomerFormValues['address_book'][0]): `address_book.${number}.${keyof CustomerFormValues['address_book'][0]}` => {
    return `address_book.${addressIndex}.${field}` as const;
  };

  const handleAddressSelect = (suggestion: any) => {
    const address = suggestion.address;
    
    if (addressIndex !== undefined) {
      form.setValue(getFieldName("street_address"), 
        `${address.house_number || ''} ${address.road || ''}`.trim());
      form.setValue(getFieldName("city"), address.city || '');
      form.setValue(getFieldName("state_province"), address.state || '');
      form.setValue(getFieldName("postal_code"), address.postcode || '');
      form.setValue(getFieldName("country"), address.country || '');
    }
    
    setOpen(false);
  };

  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormField
          control={form.control}
          name={getFieldName("street_address")}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.toString() || ''}
                  className={inputClasses}
                  placeholder="Search address..."
                  onChange={(e) => {
                    field.onChange(e);
                    setAddressSearch(e.target.value);
                    updateSearch(e.target.value);
                    if (e.target.value) setOpen(true);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search address..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                "No results found"
              )}
            </CommandEmpty>
            <CommandGroup>
              {suggestions?.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleAddressSelect(suggestion)}
                >
                  {suggestion.display_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
