
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";

interface TimezoneSelectorProps {
  form: UseFormReturn<CustomerFormValues>;
  labelClasses: string;
}

// Define standard IANA timezone list
const TIMEZONE_LIST = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Phoenix",
  "America/Denver",
  "America/Toronto",
  "America/Vancouver",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland"
];

export function TimezoneSelector({ form, labelClasses }: TimezoneSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const timezones = useMemo(() => {
    return TIMEZONE_LIST.map(zone => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
          timeZoneName: 'long',
          hour: 'numeric',
        });
        const now = new Date();
        const parts = formatter.formatToParts(now);
        const timeZonePart = parts.find(part => part.type === 'timeZoneName');
        const offset = timeZonePart ? timeZonePart.value : '';
        
        return {
          value: zone,
          label: `${zone.replace(/_/g, ' ')} (${offset})`
        };
      } catch (e) {
        console.error(`Error formatting timezone ${zone}:`, e);
        return {
          value: zone,
          label: zone.replace(/_/g, ' ')
        };
      }
    }).sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const filteredTimezones = searchValue === "" 
    ? timezones 
    : timezones.filter(timezone => 
        timezone.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        timezone.value.toLowerCase().includes(searchValue.toLowerCase())
      );

  const currentTimezone = form.watch("timezone");
  const selectedTimezone = timezones.find(tz => tz.value === currentTimezone);

  return (
    <FormField
      control={form.control}
      name="timezone"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className={labelClasses}>Timezone (Optional)</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  type="button"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {selectedTimezone?.label || "Select timezone..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Search timezone..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                {filteredTimezones.length === 0 ? (
                  <CommandEmpty>No timezone found.</CommandEmpty>
                ) : (
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredTimezones.map((timezone) => (
                      <CommandItem
                        key={timezone.value}
                        value={timezone.value}
                        onSelect={(value) => {
                          form.setValue("timezone", timezone.value);
                          field.onChange(timezone.value);
                          setOpen(false);
                          setSearchValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentTimezone === timezone.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {timezone.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
