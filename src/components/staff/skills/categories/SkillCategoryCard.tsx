import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AddSkillDialog } from "../AddSkillDialog";
import type { SkillCategory } from "../types";

interface SkillCategoryCardProps {
  category: SkillCategory;
}

export function SkillCategoryCard({ category }: SkillCategoryCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{category.name}</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {category.skills?.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between p-2 bg-secondary/20 rounded-md"
          >
            <span>{skill.name}</span>
            {skill.description && (
              <span className="text-sm text-muted-foreground">
                {skill.description}
              </span>
            )}
          </div>
        ))}
        {!category.skills?.length && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No skills added yet
          </p>
        )}
      </CardContent>
      <AddSkillDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        categoryId={category.id}
      />
    </Card>
  );
}