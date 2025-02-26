import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { SkillCategory } from "../types";

export function SkillFormFields() {
  const form = useFormContext();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['skill-categories-with-skills'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', (await supabase.auth.getSession()).data.session?.user.id)
        .single();

      if (!userProfile?.organization_id) throw new Error('No organization found');

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
        .eq('organization_id', userProfile.organization_id)
        .order('name');
      
      if (error) throw error;
      console.log('Fetched categories with skills:', data); // Debug log
      return data as SkillCategory[];
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!categories?.length) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        No skills found. Please add some skill categories and skills first.
      </div>
    );
  }

  // Debug log to see what categories we're rendering
  console.log('Rendering categories:', categories);

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
              {categories.map((category) => (
                category.skills && category.skills.length > 0 ? (
                  <div key={category.id} className="mb-2">
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {category.name}
                    </div>
                    {category.skills
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                  </div>
                ) : null
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}