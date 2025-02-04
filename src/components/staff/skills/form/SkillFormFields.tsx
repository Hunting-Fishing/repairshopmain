import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import type { Skill } from "../types";

interface SkillFormFieldsProps {
  skills: Skill[] | undefined;
}

export function SkillFormFields({ skills }: SkillFormFieldsProps) {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="skillId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skill</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {skills?.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name} {skill.category && `(${skill.category.name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}