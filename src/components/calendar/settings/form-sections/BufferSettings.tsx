import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CalendarSettingsFormValues } from "../types";

interface BufferSettingsProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}

export function BufferSettings({ form }: BufferSettingsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="bufferTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Buffer Time</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select buffer time" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0">No buffer</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Add padding time between appointments
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="maxAppointmentsPerSlot"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Appointments Per Slot</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="10"
                {...field}
                className="border-[#FEC6A1]"
              />
            </FormControl>
            <FormDescription>
              Set the maximum number of concurrent appointments
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}