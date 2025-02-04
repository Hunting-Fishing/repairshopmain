import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SkillAssessmentDialog } from "./SkillAssessmentDialog";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from "lucide-react";

export function SkillAssessment({ profileId }: { profileId?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['skill-assessments', profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_skill_assessments')
        .select(`
          *,
          skill:skills(
            name,
            category:skill_categories(name)
          ),
          assessor:profiles(first_name, last_name)
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profileId
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderProficiencyStars = (level: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < level) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === Math.floor(level) && level % 1 !== 0) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skill Assessments</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          Add Assessment
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {assessments?.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No skill assessments found
          </p>
        ) : (
          assessments?.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="font-medium">{assessment.skill?.name}</div>
                <Badge variant="secondary">
                  {assessment.skill?.category?.name}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Assessed by: {assessment.assessor?.first_name} {assessment.assessor?.last_name}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {renderProficiencyStars(assessment.proficiency_level)}
              </div>
            </div>
          ))
        )}
      </CardContent>
      <SkillAssessmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        profileId={profileId}
      />
    </Card>
  );
}