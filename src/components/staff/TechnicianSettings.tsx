import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormSectionProps } from "./types";

export function TechnicianSettings({ form }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Management Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Visibility Settings</h3>
          <FormField
            control={form.control}
            name="showTechnicianWorkload"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show Technician Workload</FormLabel>
                  <FormDescription>
                    Display workload indicators for each technician
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
            name="showTechnicianAvailability"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show Availability Status</FormLabel>
                  <FormDescription>
                    Display real-time availability status
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
            name="showTechnicianStats"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show Performance Stats</FormLabel>
                  <FormDescription>
                    Display performance metrics and statistics
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

        <Separator />

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

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Display Settings</h3>
          <FormField
            control={form.control}
            name="technicianViewMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technician View Mode</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select view mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="individual">Individual Columns</SelectItem>
                    <SelectItem value="combined">Combined View</SelectItem>
                    <SelectItem value="filtered">Filterable View</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose how technician schedules are displayed
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}