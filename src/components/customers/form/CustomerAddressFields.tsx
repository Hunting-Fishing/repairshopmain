
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddressLookup } from "@/hooks/useAddressLookup";
import { useState } from "react";
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

interface CustomerAddressFieldsProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
  addressIndex?: number;
}

type AddressField = "street_address" | "city" | "state_province" | "postal_code" | "country";

export function CustomerAddressFields({ 
  form, 
  isModernTheme = false,
  addressIndex
}: CustomerAddressFieldsProps) {
  const [addressSearch, setAddressSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { suggestions, isLoading, updateSearch } = useAddressLookup(addressSearch);

  const inputClasses = isModernTheme
    ? "bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white transition-all duration-200 rounded-lg"
    : "bg-white/80 border-[#FEC6A1]/30 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white";

  const getFieldName = (field: AddressField): `address_book.${number}.${AddressField}` | AddressField => {
    return addressIndex !== undefined 
      ? `address_book.${addressIndex}.${field}` as const
      : field;
  };

  const handleAddressSelect = (suggestion: any) => {
    const address = suggestion.address;
    
    form.setValue(getFieldName("street_address"), 
      `${address.house_number || ''} ${address.road || ''}`.trim());
    form.setValue(getFieldName("city"), address.city || '');
    form.setValue(getFieldName("state_province"), address.state || '');
    form.setValue(getFieldName("postal_code"), address.postcode || '');
    form.setValue(getFieldName("country"), address.country || '');
    
    setOpen(false);
  };

  return (
    <div className="space-y-4">
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
                <FormMessage />
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={getFieldName("city")}
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  value={value as string}
                  onChange={onChange}
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
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>State/Province</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  value={value as string}
                  onChange={onChange}
                  className={inputClasses} 
                  placeholder="Enter state or province" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={getFieldName("postal_code")}
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  value={value as string}
                  onChange={onChange}
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
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  value={value as string}
                  onChange={onChange}
                  className={inputClasses} 
                  placeholder="Enter country" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
