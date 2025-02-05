import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SkillAssessmentDialog } from "../SkillAssessmentDialog";
import { SkillAssessmentCard } from "./SkillAssessmentCard";
import type { SkillAssessment } from "../types";
import { toast } from "@/hooks/use-toast";

interface SkillAssessmentDashboardProps {
  profileId?: string;
}

export function SkillAssessmentDashboard({ profileId }: SkillAssessmentDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: assessments, isLoading, error } = useQuery({
    queryKey: ['skill-assessments', profileId],
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
          assessor:profiles!staff_skill_assessments_assessed_by_fkey (
            first_name,
            last_name
          )
        `)
        .eq('profile_id', profileId);

      if (error) {
        toast({
          title: "Error fetching assessments",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return data?.map((assessment): SkillAssessment => ({
        id: assessment.id,
        proficiency_level: assessment.proficiency_level,
        assessment_date: assessment.assessment_date,
        notes: assessment.notes,
        skill: assessment.skill?.[0] ? {
          name: assessment.skill[0].name,
          category: assessment.skill[0].category?.[0] ? {
            name: assessment.skill[0].category[0].name
          } : undefined
        } : undefined,
        assessor: assessment.assessor?.[0] ? {
          first_name: assessment.assessor[0].first_name,
          last_name: assessment.assessor[0].last_name
        } : undefined
      })) || [];
    }
  });

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-destructive">Error loading assessments</p>
        </CardContent>
      </Card>
    );
  }

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
            <SkillAssessmentCard
              key={assessment.id}
              assessment={assessment}
            />
          ))}
          {!assessments?.length && (
            <p className="text-center text-muted-foreground py-4">
              No skill assessments found
            </p>
          )}
        </div>
      </CardContent>
      <SkillAssessmentDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        profileId={profileId}
      />
    </Card>
  );
}