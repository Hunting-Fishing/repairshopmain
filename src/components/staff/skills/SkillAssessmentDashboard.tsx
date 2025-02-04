import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SkillAssessmentDialog } from "./SkillAssessmentDialog";
import { SkillAssessmentCard } from "./components/SkillAssessmentCard";
import { useSkillAssessments } from "./hooks/useSkillAssessments";
import { getProficiencyColor, getProficiencyLabel } from "./utils/proficiencyUtils";

interface SkillAssessmentDashboardProps {
  profileId?: string;
}

export function SkillAssessmentDashboard({ profileId }: SkillAssessmentDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: assessments, isLoading } = useSkillAssessments(profileId);

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
              getProficiencyColor={getProficiencyColor}
              getProficiencyLabel={getProficiencyLabel}
            />
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