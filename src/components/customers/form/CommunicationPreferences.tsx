
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
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface CommunicationPreferencesProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export const CommunicationPreferences = ({ form, isModernTheme = false }: CommunicationPreferencesProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  const labelClasses = isModernTheme
    ? "text-gray-700 font-medium text-sm uppercase tracking-wide"
    : "text-gray-700 font-medium";

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" }
  ];

  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "New York (GMT-4)" },
    { value: "America/Chicago", label: "Chicago (GMT-5)" },
    { value: "America/Denver", label: "Denver (GMT-6)" },
    { value: "America/Los_Angeles", label: "Los Angeles (GMT-7)" },
    { value: "America/Phoenix", label: "Phoenix (GMT-7)" },
    { value: "America/Anchorage", label: "Anchorage (GMT-8)" },
    { value: "America/Honolulu", label: "Honolulu (GMT-10)" },
    { value: "America/Toronto", label: "Toronto (GMT-4)" },
    { value: "America/Vancouver", label: "Vancouver (GMT-7)" },
    { value: "Europe/London", label: "London (GMT+1)" },
    { value: "Europe/Paris", label: "Paris (GMT+2)" },
    { value: "Europe/Berlin", label: "Berlin (GMT+2)" },
    { value: "Europe/Rome", label: "Rome (GMT+2)" },
    { value: "Europe/Madrid", label: "Madrid (GMT+2)" },
    { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
    { value: "Asia/Shanghai", label: "Shanghai (GMT+8)" },
    { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
    { value: "Australia/Sydney", label: "Sydney (GMT+10)" },
    { value: "Pacific/Auckland", label: "Auckland (GMT+12)" }
  ];

  const filteredTimezones = timezones.filter(timezone => 
    timezone.label.toLowerCase().includes(inputValue.toLowerCase()) ||
    timezone.value.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = useCallback((value: string) => {
    if (!value) return;
    
    const timezone = timezones.find(tz => tz.value === value);
    if (!timezone) return;

    form.setValue("timezone", timezone.value);
    setOpen(false);
    setInputValue("");
  }, [form]);

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
        rules={{
          validate: {
            validTimezone: (value) => {
              if (!value) return true;
              return timezones.some(tz => tz.value === value) || "Please select a valid timezone";
            }
          }
        }}
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
                    {field.value ? 
                      timezones.find(tz => tz.value === field.value)?.label 
                      : "Select timezone..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Search timezone..." 
                    value={inputValue}
                    onValueChange={setInputValue}
                  />
                  <CommandEmpty>No timezone found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredTimezones.map((timezone) => (
                      <CommandItem
                        key={timezone.value}
                        value={timezone.value}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === timezone.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {timezone.label}
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
