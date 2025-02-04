import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { AddSkillDialog } from "./AddSkillDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface SkillCategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string | null;
  };
}

export function SkillCategoryCard({ category }: SkillCategoryCardProps) {
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  const { data: skills } = useQuery({
    queryKey: ['skills', category.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('category_id', category.id)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">{category.name}</CardTitle>
          {category.description && (
            <p className="text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsAddSkillOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills?.map((skill) => (
            <Badge key={skill.id} variant="secondary">
              {skill.name}
            </Badge>
          ))}
          {!skills?.length && (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </CardContent>
      <AddSkillDialog 
        open={isAddSkillOpen} 
        onOpenChange={setIsAddSkillOpen}
        categoryId={category.id}
      />
    </Card>
  );
}