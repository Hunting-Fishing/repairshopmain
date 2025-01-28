import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

export function GeneralTimeSettings() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="use24HourTime"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Time Format Display</FormLabel>
              <FormDescription>
                {field.value ? "Currently showing 24-hour format (e.g., 14:00)" : "Currently showing 12-hour format (e.g., 2:00 PM)"}
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Toggle time format"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="workingHoursStart"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Working Hours Start</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour24 = i.toString().padStart(2, "0");
                    const hour12 = i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`;
                    return (
                      <SelectItem key={i} value={`${hour24}:00`}>
                        {form.watch("use24HourTime") ? `${hour24}:00` : hour12}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>Set when your work day begins</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="workingHoursEnd"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Working Hours End</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour24 = i.toString().padStart(2, "0");
                    const hour12 = i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`;
                    return (
                      <SelectItem key={i} value={`${hour24}:00`}>
                        {form.watch("use24HourTime") ? `${hour24}:00` : hour12}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>Set when your work day ends</FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}