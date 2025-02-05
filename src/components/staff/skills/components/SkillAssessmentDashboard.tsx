import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SkillAssessmentDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['skill-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_skill_assessments')
        .select(`
          id,
          proficiency_level,
          assessment_date,
          notes,
          skill:skills (
            name,
            category:skill_categories (
              name
            )
          ),
          assessor:profiles (
            first_name,
            last_name
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skill Assessments</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Assessment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessments?.map((assessment) => (
            <div key={assessment.id} className="p-4 border rounded-lg">
              <h3 className="font-medium">
                {assessment.skill?.name}
                {assessment.skill?.category?.name && (
                  <span className="text-muted-foreground ml-2">
                    ({assessment.skill.category.name})
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Proficiency Level: {assessment.proficiency_level}
              </p>
              {assessment.notes && (
                <p className="text-sm mt-2">{assessment.notes}</p>
              )}
            </div>
          ))}
          {!assessments?.length && (
            <p className="text-center text-muted-foreground py-4">
              No skill assessments found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}