
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";

interface MarketingPreferencesProps {
  form: UseFormReturn<CustomerFormValues>;
  labelClasses: string;
}

export function MarketingPreferences({ form, labelClasses }: MarketingPreferencesProps) {
  return (
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
  );
}
