
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSectionProps } from "../types";

export function TechnicianSchedulingSettings({ form }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduling Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="enableAutoAssignment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Auto-Assignment</FormLabel>
                <FormDescription>
                  Automatically assign jobs based on technician availability and specialties
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableTechnicianSpecialties"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Specialties</FormLabel>
                <FormDescription>
                  Allow assignment based on technician specialties and certifications
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

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
                Choose how to handle scheduling conflicts between technicians
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
