import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillCategoryList } from "./categories/SkillCategoryList";

export function SkillCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <SkillCategoryList />
      </CardContent>
    </Card>
  );
}