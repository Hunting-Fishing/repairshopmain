
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSectionProps } from "../types";
import { ColorPalette } from "@/components/calendar/ColorPalette";

export function DisplaySettings({ form }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Display Settings</h3>
      
      <FormField
        control={form.control}
        name="enableTechnicianColors"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Technician Colors</FormLabel>
              <FormDescription>
                Assign unique colors to technicians in the calendar
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("enableTechnicianColors") && (
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">Technician Category Colors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground">Shift Types</h5>
              <FormField
                control={form.control}
                name="technicianColors.morningShift"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Morning Shift</FormLabel>
                    <ColorPalette selectedColor={field.value || "#8B5CF6"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="technicianColors.dayShift"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Day Shift</FormLabel>
                    <ColorPalette selectedColor={field.value || "#22c55e"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="technicianColors.nightShift"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Night Shift</FormLabel>
                    <ColorPalette selectedColor={field.value || "#3B82F6"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground">Roles</h5>
              <FormField
                control={form.control}
                name="technicianColors.foreman"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Foreman</FormLabel>
                    <ColorPalette selectedColor={field.value || "#F97316"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="technicianColors.apprentice"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Apprentice</FormLabel>
                    <ColorPalette selectedColor={field.value || "#7C3AED"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="technicianColors.certified"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Certified</FormLabel>
                    <ColorPalette selectedColor={field.value || "#0EA5E9"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground">Specialties</h5>
              <FormField
                control={form.control}
                name="technicianColors.lube"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Lube</FormLabel>
                    <ColorPalette selectedColor={field.value || "#D946EF"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="technicianColors.tires"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Tires</FormLabel>
                    <ColorPalette selectedColor={field.value || "#6E59A5"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="technicianColors.diagnostic"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>Diagnostic</FormLabel>
                    <ColorPalette selectedColor={field.value || "#9b87f5"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="technicianColors.general"
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <FormLabel>General</FormLabel>
                    <ColorPalette selectedColor={field.value || "#8E9196"} onColorSelect={field.onChange} />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}

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
  );
}
