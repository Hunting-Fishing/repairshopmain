import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import type { Skill } from "../types";

interface SkillFormFieldsProps {
  skills: Skill[] | undefined;
}

export function SkillFormFields({ skills }: SkillFormFieldsProps) {
  const form = useFormContext();

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    const categoryName = skill.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedSkills || {}).sort();

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
                {sortedCategories.map((category) => (
                  <div key={category} className="mb-2">
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {category}
                    </div>
                    {groupedSkills?.[category]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                  </div>
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