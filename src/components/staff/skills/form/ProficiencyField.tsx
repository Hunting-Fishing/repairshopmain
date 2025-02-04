import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export function ProficiencyField() {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="proficiencyLevel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Proficiency Level</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="1">1 - Beginner</SelectItem>
              <SelectItem value="2">2 - Advanced Beginner</SelectItem>
              <SelectItem value="3">3 - Competent</SelectItem>
              <SelectItem value="4">4 - Proficient</SelectItem>
              <SelectItem value="5">5 - Expert</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}