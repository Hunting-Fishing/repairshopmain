
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";

interface TimezoneSelectorProps {
  form: UseFormReturn<CustomerFormValues>;
  labelClasses: string;
}

export function TimezoneSelector({ form, labelClasses }: TimezoneSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

  const filteredTimezones = searchValue === "" 
    ? timezones 
    : timezones.filter(timezone => 
        timezone.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        timezone.value.toLowerCase().includes(searchValue.toLowerCase())
      );

  const currentTimezone = form.watch("timezone");
  const selectedTimezone = timezones.find(tz => tz.value === currentTimezone);

  const handleSelect = (value: string) => {
    // Handle empty selection
    if (!value) {
      form.setValue("timezone", undefined);
      field.onChange(undefined);
    } else {
      form.setValue("timezone", value);
      field.onChange(value);
    }
    setOpen(false);
    setSearchValue("");
  };

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
              <Command>
                <CommandInput 
                  placeholder="Search timezone..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandEmpty>No timezone found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {filteredTimezones.map((timezone) => (
                    <CommandItem
                      key={timezone.value}
                      value={timezone.value}
                      onSelect={() => handleSelect(timezone.value)}
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
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
