
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UseFormReturn, useWatch } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimezoneSelectorProps {
  form: UseFormReturn<CustomerFormValues>;
  labelClasses: string;
}

const timezones = [
  { value: "UTC", label: "UTC", country: "" },
  { value: "America/New_York", label: "Eastern Time (ET)", country: "US" },
  { value: "America/Chicago", label: "Central Time (CT)", country: "US" },
  { value: "America/Denver", label: "Mountain Time (MT)", country: "US" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", country: "US" },
  { value: "America/Phoenix", label: "Arizona Time", country: "US" },
  { value: "Europe/London", label: "London", country: "GB" },
  { value: "Europe/Paris", label: "Paris", country: "FR" },
  { value: "Asia/Tokyo", label: "Tokyo", country: "JP" },
  { value: "Asia/Shanghai", label: "Shanghai", country: "CN" },
  { value: "Australia/Sydney", label: "Sydney", country: "AU" }
];

// Map of common country codes to timezone values
const countryTimezoneMap: Record<string, string> = {
  'US': 'America/New_York', // Default US timezone
  'GB': 'Europe/London',
  'FR': 'Europe/Paris',
  'JP': 'Asia/Tokyo',
  'CN': 'Asia/Shanghai',
  'AU': 'Australia/Sydney',
};

// Helper function to get current time in a timezone
const getCurrentTimeInTimezone = (timezone: string) => {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '';
  }
};

export function TimezoneSelector({ form, labelClasses }: TimezoneSelectorProps) {
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({});
  
  // Watch for changes in the country field
  const country = useWatch({
    control: form.control,
    name: "country"
  });

  // Update times every minute
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      timezones.forEach(tz => {
        times[tz.value] = getCurrentTimeInTimezone(tz.value);
      });
      setCurrentTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Set timezone based on country when country changes
  useEffect(() => {
    if (country && countryTimezoneMap[country]) {
      form.setValue('timezone', countryTimezoneMap[country]);
    }
  }, [country, form]);

  return (
    <FormField
      control={form.control}
      name="timezone"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className={labelClasses}>Timezone</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={cn(
                "w-full bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg",
                "h-10 px-3 py-2"
              )}>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {timezones.map((timezone) => (
                <SelectItem
                  key={timezone.value}
                  value={timezone.value}
                  className="cursor-pointer flex items-center justify-between gap-2"
                >
                  <span>{timezone.label}</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {currentTimes[timezone.value]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
