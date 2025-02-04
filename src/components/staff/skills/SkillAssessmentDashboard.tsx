import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SkillAssessmentDialog } from "./SkillAssessmentDialog";
import { Badge } from "@/components/ui/badge";

interface SkillAssessment {
  id: string;
  skill: {
    name: string;
    category: {
      name: string;
    } | null;
  };
  proficiency_level: number;
  assessment_date: string;
  notes?: string;
  assessor?: {
    first_name: string;
    last_name: string;
  };
}

interface SkillAssessmentDashboardProps {
  profileId?: string;
}

export function SkillAssessmentDashboard({ profileId }: SkillAssessmentDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['skill-assessments', profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_skill_assessments')
        .select(`
          id,
          proficiency_level,
          assessment_date,
          notes,
          skill:skills(
            name,
            category:skill_categories(name)
          ),
          assessor:profiles(first_name, last_name)
        `)
        .eq('profile_id', profileId)
        .order('assessment_date', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data.map((assessment): SkillAssessment => ({
        id: assessment.id,
        proficiency_level: assessment.proficiency_level,
        assessment_date: assessment.assessment_date,
        notes: assessment.notes,
        skill: {
          name: assessment.skill?.[0]?.name || '',
          category: assessment.skill?.[0]?.category ? {
            name: assessment.skill[0].category.name
          } : null
        },
        assessor: assessment.assessor?.[0] ? {
          first_name: assessment.assessor[0].first_name,
          last_name: assessment.assessor[0].last_name
        } : undefined
      }));

      return transformedData;
    },
    enabled: !!profileId
  });

  const getProficiencyColor = (level: number) => {
    switch (level) {
      case 1: return "bg-red-100 text-red-800";
      case 2: return "bg-orange-100 text-orange-800";
      case 3: return "bg-yellow-100 text-yellow-800";
      case 4: return "bg-green-100 text-green-800";
      case 5: return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProficiencyLabel = (level: number) => {
    switch (level) {
      case 1: return "Beginner";
      case 2: return "Advanced Beginner";
      case 3: return "Competent";
      case 4: return "Proficient";
      case 5: return "Expert";
      default: return "Unknown";
    }
  };

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
            <div
              key={assessment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="font-medium">{assessment.skill?.name}</div>
                {assessment.skill?.category && (
                  <Badge variant="secondary">
                    {assessment.skill.category.name}
                  </Badge>
                )}
                {assessment.notes && (
                  <p className="text-sm text-muted-foreground">{assessment.notes}</p>
                )}
                {assessment.assessor && (
                  <div className="text-sm text-muted-foreground">
                    Assessed by: {assessment.assessor.first_name} {assessment.assessor.last_name}
                  </div>
                )}
              </div>
              <Badge className={getProficiencyColor(assessment.proficiency_level)}>
                {getProficiencyLabel(assessment.proficiency_level)}
              </Badge>
            </div>
          ))}
          {!isLoading && (!assessments || assessments.length === 0) && (
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