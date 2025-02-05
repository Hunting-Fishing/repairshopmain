import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SkillCategory } from "./types";

interface SkillCategoryCardProps {
  category: SkillCategory;
}

export function SkillCategoryCard({ category }: SkillCategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{category.name}</CardTitle>
        {category.description && (
          <p className="text-sm text-muted-foreground">{category.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {category.skills?.map((skill) => (
            <Badge key={skill.id} variant="secondary">
              {skill.name}
            </Badge>
          ))}
          {!category.skills?.length && (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}