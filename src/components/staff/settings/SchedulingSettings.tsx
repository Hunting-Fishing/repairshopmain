import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSectionProps } from "../types";

export function SchedulingSettings({ form }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Scheduling Features</h3>
      <FormField
        control={form.control}
        name="technicianScheduleConflictHandling"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Schedule Conflict Handling</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select conflict handling" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="warn">Warn Only</SelectItem>
                <SelectItem value="block">Block Conflicts</SelectItem>
                <SelectItem value="allow">Allow Overlaps</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose how to handle scheduling conflicts
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}