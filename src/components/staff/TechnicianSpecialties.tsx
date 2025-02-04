import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SkillCategories } from "./skills/SkillCategories";
import { SkillAssessmentDashboard } from "./skills/SkillAssessmentDashboard";

export function TechnicianSpecialties() {
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
      return data;
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
            <SkillCategories />
          </TabsContent>
          
          <TabsContent value="assessments">
            <SkillAssessmentDashboard />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}