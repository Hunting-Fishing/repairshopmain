
import { UseFormReturn, useWatch } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { FormSection } from "../FormSection";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { FormInput } from "../fields/FormInput";
import { Clock } from "lucide-react";

interface PreferencesSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
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
  'US': 'America/New_York',
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

export function PreferencesSection({
  form,
  isModernTheme = false,
}: PreferencesSectionProps) {
  // Watch for changes in the country field
  const country = useWatch({
    control: form.control,
    name: "country"
  });

  // Set timezone based on country when country changes
  useEffect(() => {
    if (country && countryTimezoneMap[country] && !form.getValues('timezone')) {
      form.setValue('timezone', countryTimezoneMap[country]);
    }
  }, [country, form]);

  return (
    <FormSection 
      title="Preferences & Contact Settings" 
      description="Customer communication and account preferences"
      isModernTheme={isModernTheme}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Timezone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white/80 border-orange-200/50 focus:border-[#F97316] focus:ring-[#F97316]/20 hover:bg-white rounded-lg">
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
                          {getCurrentTimeInTimezone(timezone.value)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormInput
            form={form}
            name="language_preference"
            label="Preferred Language"
            placeholder="Select language"
            helpText="Customer's preferred language for communications"
            isModernTheme={isModernTheme}
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Marketing Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="email-marketing"
                checked={form.watch("marketing_preferences.email")}
                onCheckedChange={(checked) => 
                  form.setValue("marketing_preferences.email", checked)
                }
              />
              <Label htmlFor="email-marketing">Email Marketing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="sms-marketing"
                checked={form.watch("marketing_preferences.sms")}
                onCheckedChange={(checked) => 
                  form.setValue("marketing_preferences.sms", checked)
                }
              />
              <Label htmlFor="sms-marketing">SMS Marketing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="phone-marketing"
                checked={form.watch("marketing_preferences.phone")}
                onCheckedChange={(checked) => 
                  form.setValue("marketing_preferences.phone", checked)
                }
              />
              <Label htmlFor="phone-marketing">Phone Marketing</Label>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Secondary Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              form={form}
              name="secondary_contact.name"
              label="Contact Name"
              placeholder="Enter secondary contact name"
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="secondary_contact.phone"
              label="Contact Phone"
              placeholder="Enter secondary contact phone"
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="secondary_contact.email"
              label="Contact Email"
              placeholder="Enter secondary contact email"
              isModernTheme={isModernTheme}
            />
            <FormInput
              form={form}
              name="secondary_contact.relationship"
              label="Relationship"
              placeholder="Enter relationship to customer"
              isModernTheme={isModernTheme}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}
