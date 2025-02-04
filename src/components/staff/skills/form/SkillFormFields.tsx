import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  id: string;
  name: string;
  category?: {
    name: string;
  } | null;
}

interface SkillFormFieldsProps {
  skills?: Skill[];
}

export function SkillFormFields({ skills: propSkills }: SkillFormFieldsProps) {
  const form = useFormContext();

  const { data: fetchedSkills } = useQuery({
    queryKey: ['skills-with-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          id,
          name,
          category:skill_categories (
            name
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data as Skill[];
    },
    enabled: !propSkills, // Only fetch if skills aren't provided as props
  });

  const skills = propSkills || fetchedSkills || [];

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const categoryName = skill.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    // Only add if not already present
    if (!acc[categoryName].find(s => s.id === skill.id)) {
      acc[categoryName].push(skill);
    }
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort categories alphabetically, but keep Uncategorized at the end
  const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
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
              {sortedCategories.map((category) => (
                <div key={category} className="mb-2">
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {groupedSkills[category]
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
  );
}
