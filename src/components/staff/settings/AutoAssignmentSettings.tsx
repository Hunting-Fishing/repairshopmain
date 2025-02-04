import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { FormSectionProps } from "../types";

const WORK_TYPES = [
  "Maintenance",
  "Repair",
  "Diagnostic",
  "Installation",
  "Emergency",
  "Inspection"
];

export function AutoAssignmentSettings({ form }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Auto-Assignment Settings</h3>
      <FormField
        control={form.control}
        name="enableAutoAssignment"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Auto-Assignment</FormLabel>
              <FormDescription>
                Automatically assign work orders to technicians
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("enableAutoAssignment") && (
        <>
          <FormField
            control={form.control}
            name="maxDailyBookings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Daily Bookings</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={24}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of bookings a technician can have per day
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredWorkTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Work Types</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={WORK_TYPES.map(type => ({
                      label: type,
                      value: type.toLowerCase()
                    }))}
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Select the types of work this technician prefers
                </FormDescription>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}