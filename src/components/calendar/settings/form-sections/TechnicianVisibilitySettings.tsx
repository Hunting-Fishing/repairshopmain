
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { FormSectionProps } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TechnicianVisibilitySettings({ form }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibility Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="showTechnicianWorkload"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show Technician Workload</FormLabel>
                <FormDescription>
                  Display workload indicators for each technician in the calendar view
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
          name="showTechnicianAvailability"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show Availability Status</FormLabel>
                <FormDescription>
                  Display real-time availability status for each technician
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
          name="showTechnicianStats"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show Performance Stats</FormLabel>
                <FormDescription>
                  Display performance metrics and job completion statistics
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
