
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSectionProps } from "../types";
import { ColorPalette } from "@/components/calendar/ColorPalette";
import { useState } from "react";

const DEFAULT_COLORS: [string, string] = ["#000000", "#FFD700"];

export function DisplaySettings({ form }: FormSectionProps) {
  const [activeColorIndexes, setActiveColorIndexes] = useState<Record<string, 0 | 1>>({});

  const handleColorSelect = (fieldName: keyof TechnicianSettingsFormValues['technicianColors'], colors: [string, string]) => {
    form.setValue(`technicianColors.${fieldName}`, colors);
  };

  const getColorPair = (fieldName: keyof TechnicianSettingsFormValues['technicianColors']): [string, string] => {
    const value = form.watch(`technicianColors.${fieldName}`);
    return Array.isArray(value) ? value : DEFAULT_COLORS;
  };

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
                Assign unique dual colors to technicians in the calendar
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
              {(['morningShift', 'dayShift', 'nightShift'] as const).map((shift) => (
                <div key={shift} className="flex items-center justify-between">
                  <FormLabel className="capitalize">
                    {shift.replace(/([A-Z])/g, ' $1').trim()}
                  </FormLabel>
                  <ColorPalette
                    selectedColors={getColorPair(shift)}
                    onColorSelect={(colors) => handleColorSelect(shift, colors)}
                    activeColorIndex={activeColorIndexes[shift] || 0}
                    onActiveColorChange={(index) => 
                      setActiveColorIndexes(prev => ({ ...prev, [shift]: index as 0 | 1 }))
                    }
                  />
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground">Roles</h5>
              {(['foreman', 'apprentice', 'certified'] as const).map((role) => (
                <div key={role} className="flex items-center justify-between">
                  <FormLabel className="capitalize">{role}</FormLabel>
                  <ColorPalette
                    selectedColors={getColorPair(role)}
                    onColorSelect={(colors) => handleColorSelect(role, colors)}
                    activeColorIndex={activeColorIndexes[role] || 0}
                    onActiveColorChange={(index) => 
                      setActiveColorIndexes(prev => ({ ...prev, [role]: index as 0 | 1 }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground">Specialties</h5>
              {(['lube', 'tires', 'diagnostic', 'general'] as const).map((specialty) => (
                <div key={specialty} className="flex items-center justify-between">
                  <FormLabel className="capitalize">{specialty}</FormLabel>
                  <ColorPalette
                    selectedColors={getColorPair(specialty)}
                    onColorSelect={(colors) => handleColorSelect(specialty, colors)}
                    activeColorIndex={activeColorIndexes[specialty] || 0}
                    onActiveColorChange={(index) => 
                      setActiveColorIndexes(prev => ({ ...prev, [specialty]: index as 0 | 1 }))
                    }
                  />
                </div>
              ))}
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
