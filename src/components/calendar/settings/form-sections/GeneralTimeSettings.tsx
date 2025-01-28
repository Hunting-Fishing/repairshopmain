import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CalendarSettingsFormValues } from "../types";

interface GeneralTimeSettingsProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}

export function GeneralTimeSettings({ form }: GeneralTimeSettingsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="timeFormat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time Format</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24">24-hour</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose how times are displayed throughout the calendar
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="workingHoursStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Hours Start</FormLabel>
              <FormControl>
                <Input type="time" {...field} className="border-[#FEC6A1]" />
              </FormControl>
              <FormDescription>Set your shop's opening time</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workingHoursEnd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Hours End</FormLabel>
              <FormControl>
                <Input type="time" {...field} className="border-[#FEC6A1]" />
              </FormControl>
              <FormDescription>Set your shop's closing time</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}