import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function BufferSettings() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="bufferBefore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Buffer Time Before</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select buffer time before" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>Add preparation time before each appointment</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bufferAfter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Buffer Time After</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select buffer time after" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>Add cleanup time after each appointment</FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}