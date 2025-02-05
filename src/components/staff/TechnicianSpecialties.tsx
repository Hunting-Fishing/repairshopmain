import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillCategoryList } from "./skills/categories/SkillCategoryList";
import { SkillAssessmentDashboard } from "./skills/SkillAssessmentDashboard";

export function TechnicianSpecialties() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Specialties</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Skill Categories</TabsTrigger>
            <TabsTrigger value="assessments">Skill Assessments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <SkillCategoryList />
          </TabsContent>
          
          <TabsContent value="assessments">
            <SkillAssessmentDashboard />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}