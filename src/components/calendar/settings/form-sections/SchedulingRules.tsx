import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { CalendarSettingsFormValues } from "../types";

interface SchedulingRulesProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}

export function SchedulingRules({ form }: SchedulingRulesProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="showOverlappingBookings"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#FEC6A1] p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Show Overlapping Bookings
              </FormLabel>
              <FormDescription>
                Display multiple bookings in the same time slot
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allowDoubleBookings"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#FEC6A1] p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Allow Double Bookings
              </FormLabel>
              <FormDescription>
                Enable multiple appointments at the same time
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}