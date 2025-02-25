
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";

interface TimezoneSelectorProps {
  form: UseFormReturn<CustomerFormValues>;
  labelClasses: string;
}

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Shanghai", label: "Shanghai" },
  { value: "Australia/Sydney", label: "Sydney" }
];

export function TimezoneSelector({ form, labelClasses }: TimezoneSelectorProps) {
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
                  className="cursor-pointer"
                >
                  {timezone.label}
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
