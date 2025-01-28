import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CalendarSettingsFormValues } from "../types";

interface GeneralViewSettingsProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}

export function GeneralViewSettings({ form }: GeneralViewSettingsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="defaultView"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Default Calendar View</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose how the calendar appears when first loaded
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="timeIncrement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time Increment</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select time increment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Set the duration of appointment time slots
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}