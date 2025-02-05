import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Skill } from "../types";

interface SkillFormFieldsProps {
  skills?: Skill[];
}

export function SkillFormFields({ skills: propSkills }: SkillFormFieldsProps) {
  const form = useFormContext();

  const { data: categories } = useQuery({
    queryKey: ['skill-categories-with-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_categories')
        .select(`
          id,
          name,
          skills (
            id,
            name,
            description
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !propSkills,
  });

  return (
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
              {categories?.map((category) => (
                <div key={category.id} className="mb-2">
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    {category.name}
                  </div>
                  {category.skills
                    ?.sort((a, b) => a.name.localeCompare(b.name))
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
  );
}