
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";

interface CommunicationPreferencesProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export const CommunicationPreferences = ({ form, isModernTheme = false }: CommunicationPreferencesProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700 font-medium";

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" }
  ];

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Phoenix",
    "America/Anchorage",
    "America/Honolulu",
    "America/Toronto",
    "America/Vancouver",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Rome",
    "Europe/Madrid",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Australia/Sydney",
    "Pacific/Auckland"
  ];

  const filteredTimezones = timezones.filter(timezone => 
    timezone.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Communication Preferences</h3>
      
      <FormField
        control={form.control}
        name="language_preference"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Preferred Language</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>Timezone</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value || "Select timezone..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command value={searchValue} onValueChange={setSearchValue}>
                  <CommandInput value={searchValue} onValueChange={setSearchValue} placeholder="Search timezone..." />
                  <CommandEmpty>No timezone found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredTimezones.map((timezone) => (
                      <CommandItem
                        key={timezone}
                        value={timezone}
                        onSelect={() => {
                          field.onChange(timezone);
                          setSearchValue("");
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === timezone ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {timezone}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <Label className={labelClasses}>Marketing Preferences</Label>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="marketing_preferences.email"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label>Email Marketing</Label>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketing_preferences.sms"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label>SMS Marketing</Label>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketing_preferences.phone"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label>Phone Marketing</Label>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
