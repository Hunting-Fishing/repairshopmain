
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSectionProps } from "../types";

export function TechnicianDisplaySettings({ form }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="enableTechnicianColors"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Technician Colors</FormLabel>
                <FormDescription>
                  Assign unique colors to each technician's appointments
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
                Choose how technician schedules are displayed in the calendar
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
