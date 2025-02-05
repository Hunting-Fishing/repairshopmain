import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddSkillCategoryDialog } from "./AddSkillCategoryDialog";
import { SkillCategoryCard } from "./SkillCategoryCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { SkillCategory } from "./types";

export function SkillCategories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['skill-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_categories')
        .select(`
          *,
          skills (
            id,
            name,
            description
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data as SkillCategory[];
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skill Categories</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <SkillCategoryCard key={category.id} category={category} />
        ))}
        {categories?.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-4">
            No skill categories found. Add one to get started.
          </p>
        )}
      </CardContent>
      <AddSkillCategoryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </Card>
  );
}